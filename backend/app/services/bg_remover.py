import logging
from PIL import Image

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
            logger.warning(f"Não foi possível carregar u2net_cloth_seg ({e}). Usando fallback padrão...")
            from rembg import new_session
            _cloth_session = new_session("u2net")
    return _cloth_session

def remover_fundo_roupa(imagem_pil: Image.Image, max_dim: int = 1200) -> Image.Image:
    """
    Redimensiona proporcionalmente e remove o fundo da peça de roupa, retornando imagem com canal alfa (transparente).
    """
    from rembg import remove
    
    # Redimensiona para velocidade mantendo proporção
    img_copy = imagem_pil.copy()
    img_copy.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    
    session = get_cloth_session()
    imagem_sem_fundo = remove(img_copy, session=session)
    
    return imagem_sem_fundo
