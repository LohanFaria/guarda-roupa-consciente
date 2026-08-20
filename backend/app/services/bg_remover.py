import logging
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

_cloth_session = None

def get_cloth_session():
    """
    Inicializa a sessão do rembg com o modelo u2net_cloth_seg em modo lazy/singleton.
    """
    global _cloth_session
    if _cloth_session is None:
        try:
            from rembg import new_session
            logger.info("Inicializando modelo rembg (u2net_cloth_seg)...")
            _cloth_session = new_session("u2net_cloth_seg")
        except Exception as e:
            logger.warning(f"Não foi possível carregar u2net_cloth_seg ({e}). Usando fallback u2net padrão...")
            from rembg import new_session
            _cloth_session = new_session("u2net")
    return _cloth_session

def normalizar_imagem(imagem_pil: Image.Image) -> Image.Image:
    """
    Corrige orientação EXIF (fotos de smartphone) e converte paletas de transparência para RGB/RGBA.
    """
    # 1. Corrige rotação de celular via EXIF
    try:
        imagem_pil = ImageOps.exif_transpose(imagem_pil)
    except Exception as e:
        logger.debug(f"Sem dados EXIF para transposição: {e}")

    # 2. Converte modos especiais (CMYK, P, 1, L) para RGB
    if imagem_pil.mode in ("RGBA", "LA"):
        return imagem_pil
    elif imagem_pil.mode == "P" and "transparency" in imagem_pil.info:
        return imagem_pil.convert("RGBA")
    else:
        return imagem_pil.convert("RGB")

def remover_fundo_roupa(imagem_pil: Image.Image, max_dim: int = 1200) -> Image.Image:
    """
    Redimensiona proporcionalmente e remove o fundo da peça de roupa, retornando imagem com canal alfa (transparente).
    """
    from rembg import remove
    
    # Normaliza imagem e orientação
    img_normalizada = normalizar_imagem(imagem_pil)

    # Redimensiona para velocidade mantendo proporção
    img_copy = img_normalizada.copy()
    img_copy.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    
    session = get_cloth_session()
    imagem_sem_fundo = remove(img_copy, session=session)
    
    return imagem_sem_fundo
