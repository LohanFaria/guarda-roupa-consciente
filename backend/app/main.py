import io
import base64
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from app.config import GEMINI_API_KEY
from app.schemas import ProcessClothingResponse, HealthResponse
from app.services.bg_remover import remover_fundo_roupa
from app.services.gemini_classifier import classificar_roupa_com_gemini

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("guarda-roupa-api")

app = FastAPI(
    title="Guarda-Roupa Consciente AI API",
    description="API de processamento de fotos de roupas com remoção de fundo e IA do Google Gemini (ODS 12)",
    version="1.0.0"
)

# CORS para aceitar requisições do frontend Vite (local ou em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")
    return HealthResponse(
        status="ok",
        version="1.0.0",
        ai_service="gemini-1.5-flash (ativo)" if has_gemini else "gemini-1.5-flash (chave pendente no .env)"
    )

@app.post("/api/process-clothing", response_model=ProcessClothingResponse)
async def process_clothing(file: UploadFile = File(...)):
    """
    Recebe uma imagem da peça de vestuário, executa remoção de fundo e extrai os atributos usando IA.
    """
    try:
        logger.info(f"Processando imagem recebida: {file.filename} ({file.content_type})")
        
        contents = await file.read()
        image_original = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 1. Remoção de fundo (rembg)
        image_nobg = remover_fundo_roupa(image_original)
        
        # 2. Categorização inteligente (Google Gemini 1.5 Flash)
        metadata = classificar_roupa_com_gemini(image_nobg)
        
        # 3. Converter imagem sem fundo para Base64 PNG
        buffered = io.BytesIO()
        image_nobg.save(buffered, format="PNG")
        nobg_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        logger.info(f"Processamento concluído com sucesso: {metadata.nome_sugerido} ({metadata.categoria})")
        
        return ProcessClothingResponse(
            success=True,
            metadata=metadata,
            image_nobg_base64=f"data:image/png;base64,{nobg_base64}",
            message="Imagem processada e categorizada com sucesso."
        )

    except Exception as e:
        logger.error(f"Erro ao processar imagem de vestuário: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno no pipeline de imagem: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
