import io
import sys
import base64
import logging
import asyncio
from pathlib import Path

# Garante que a pasta backend e a pasta raiz estejam sempre no sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

try:
    from app.config import GEMINI_API_KEY
    from app.schemas import ProcessClothingResponse, HealthResponse
    from app.services.bg_remover import remover_fundo_roupa
    from app.services.gemini_classifier import classificar_roupa_com_gemini
except ImportError:
    from .config import GEMINI_API_KEY
    from .schemas import ProcessClothingResponse, HealthResponse
    from .services.bg_remover import remover_fundo_roupa
    from .services.gemini_classifier import classificar_roupa_com_gemini

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("guarda-roupa-api")

app = FastAPI(
    title="Guarda-Roupa Consciente AI API",
    description="API de processamento de fotos de roupas com remoção de fundo e IA do Google Gemini (ODS 12)",
    version="1.0.0"
)

# Configuração robusta de CORS para suportar Localhost, PWA e Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health_check():
    has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")
    return HealthResponse(
        status="ok",
        version="1.0.0",
        ai_service="gemini-flash (ativo)" if has_gemini else "gemini-flash (chave pendente no .env)"
    )

def _executar_pipeline_imagem(contents: bytes, filename: str) -> ProcessClothingResponse:
    """
    Função síncrona executada em threadpool para não bloquear o event loop do FastAPI.
    """
    try:
        image_original = Image.open(io.BytesIO(contents))
    except Exception as img_err:
        logger.error(f"Erro ao abrir formato de imagem: {img_err}")
        raise HTTPException(
            status_code=400,
            detail="O arquivo enviado não é uma imagem válida ou está corrompido."
        )

    # 1. Normalização & Remoção de fundo (rembg)
    image_nobg = remover_fundo_roupa(image_original)

    # 2. Categorização inteligente (Google Gemini Vision)
    metadata = classificar_roupa_com_gemini(image_nobg)

    # 3. Converter imagem sem fundo para Base64 PNG
    buffered = io.BytesIO()
    image_nobg.save(buffered, format="PNG", optimize=True)
    nobg_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    logger.info(f"Peça processada com sucesso: {metadata.nome_sugerido} | Categoria: {metadata.categoria}")

    return ProcessClothingResponse(
        success=True,
        metadata=metadata,
        image_nobg_base64=f"data:image/png;base64,{nobg_base64}",
        message="Imagem processada e categorizada com sucesso."
    )

@app.post("/api/process-clothing", response_model=ProcessClothingResponse)
async def process_clothing(file: UploadFile = File(...)):
    """
    Endpoint assíncrono para envio de foto da roupa.
    Executa o corte de fundo e a inferência de IA sem bloquear conexões simultâneas.
    """
    # Validação de tipo de arquivo
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de arquivo não suportado: {file.content_type}. Envie uma imagem (JPEG, PNG, WebP)."
        )

    logger.info(f"Recebendo upload: {file.filename} (content-type: {file.content_type})")
    
    contents = await file.read()
    if not contents or len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="O arquivo enviado está vazio."
        )

    # Executa processamento pesado em threadpool para alta performance
    resultado = await asyncio.to_thread(_executar_pipeline_imagem, contents, file.filename or "foto.jpg")
    return resultado

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
