import logging
from PIL import Image
from app.config import GEMINI_API_KEY
from app.schemas import ClothingMetadata

logger = logging.getLogger(__name__)

def classificar_roupa_com_gemini(imagem_pil: Image.Image) -> ClothingMetadata:
    """
    Envia a imagem da peça de roupa para o Google Gemini 1.5 Flash com Structured JSON Outputs.
    Se a chave não estiver configurada ou a chamada falhar, retorna um fallback seguro para permitir testes.
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

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[imagem_pil, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ClothingMetadata,
                temperature=0.1
            ),
        )

        return ClothingMetadata.model_validate_json(response.text)

    except Exception as e:
        logger.error(f"Erro na chamada do Gemini: {e}")
        # Retorno de fallback gracioso para não travar a experiência do usuário
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
