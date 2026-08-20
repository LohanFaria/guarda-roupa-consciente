import logging
from PIL import Image
from app.config import GEMINI_API_KEY
from app.schemas import ClothingMetadata

logger = logging.getLogger(__name__)

# Modelos prioritários ativos e testados com resposta rápida
MODELS_TO_TRY = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-2.5-pro',
    'gemini-flash-latest'
]

def classificar_roupa_com_gemini(imagem_pil: Image.Image) -> ClothingMetadata:
    """
    Envia a imagem da peça de roupa para o Google Gemini com Structured JSON Outputs.
    Possui sistema de fallback automático entre modelos Gemini e resposta segura de contingência.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        logger.warning("GEMINI_API_KEY não configurada. Usando fallback de desenvolvimento.")
        return ClothingMetadata(
            nome_sugerido="Peça Cadastrada",
            categoria="superior",
            subcategoria="camiseta",
            cor_primaria="preto",
            cores_secundarias=[],
            estacao="todas",
            ocasiao_recomendada="casual",
            estilo="básico",
            padrao_estampa="lisa"
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=GEMINI_API_KEY)
        
        prompt = (
            "Você é um especialista em análise visual de roupas para o aplicativo de consumo consciente Guarda-Roupa Consciente (ODS 12). "
            "Examine detalhadamente a foto da peça de roupa e forneça a classificação exata dos atributos solicitados."
        )

        last_error = None
        for model_name in MODELS_TO_TRY:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=[imagem_pil, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=ClothingMetadata,
                        temperature=0.1
                    ),
                )
                logger.info(f"Classificação realizada com sucesso usando modelo: {model_name}")
                return ClothingMetadata.model_validate_json(response.text)
            except Exception as model_err:
                logger.warning(f"Tentativa com {model_name} falhou: {model_err}. Tentando próximo modelo...")
                last_error = model_err

        if last_error:
            logger.error(f"Todos os modelos Gemini falharam: {last_error}")

    except Exception as e:
        logger.error(f"Erro geral no cliente Gemini: {e}")

    # Fallback gracioso para nunca quebrar a experiência do usuário
    return ClothingMetadata(
        nome_sugerido="Peça Identificada",
        categoria="superior",
        subcategoria="casual",
        cor_primaria="preto",
        cores_secundarias=[],
        estacao="todas",
        ocasiao_recomendada="casual",
        estilo="casual",
        padrao_estampa="lisa"
    )
