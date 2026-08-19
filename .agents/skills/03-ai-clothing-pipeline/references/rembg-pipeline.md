# Guia Técnico: Serviço Local de Remoção de Fundo (`rembg`)

Este documento orienta a implementação do módulo de remoção de fundo utilizando a biblioteca `rembg` com o modelo pré-treinado `u2net_cloth_seg`.

---

## 1. Instalação e Dependências

Instale os pacotes necessários no ambiente virtual Python:

```bash
pip install rembg onnxruntime pillow fastapi uvicorn
```

---

## 2. Implementação do Módulo (`backend/app/services/bg_remover.py`)

```python
from rembg import remove, new_session
from PIL import Image

# Inicializa e mantém em memória a sessão com o modelo treinado para roupas
_cloth_session = None

def get_cloth_session():
    global _cloth_session
    if _cloth_session is None:
        # u2net_cloth_seg é otimizado para peças de roupas
        _cloth_session = new_session("u2net_cloth_seg")
    return _cloth_session

def remover_fundo_roupa(imagem_pil: Image.Image, max_dim: int = 1200) -> Image.Image:
    """
    Remove o fundo de uma imagem de roupa preservando detalhes e retornando uma imagem RGBA com fundo transparente.
    """
    # Redimensiona proporcionalmente para ganho de velocidade mantendo nitidez
    imagem_pil.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    
    session = get_cloth_session()
    imagem_sem_fundo = remove(imagem_pil, session=session)
    
    return imagem_sem_fundo
```

---

## 3. Otimizações de Desempenho

1. **Warmup do Modelo:** Na inicialização da API FastAPI (`@app.on_event("startup")`), execute uma chamada de warmup com uma imagem em branco 10x10 para carregar os pesos ONNX na memória antes da primeira requisição do usuário.
2. **Redimensionamento Prévio:** Manter imagens entre 800px e 1200px reduz o tempo de inferência de 6s para menos de 1.5s com perda visual imperceptível.
3. **Formato de Saída:** Salvar em PNG com compressão otimizada ou WebP com canal alfa (transparência).
