from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class ClothingMetadata(BaseModel):
    nome_sugerido: str = Field(..., description="Nome curto e direto da peça (ex: Camiseta Preta Básica, Calça Jeans Reta)")
    categoria: Literal['superior', 'inferior', 'corpo_inteiro', 'sobreposicao', 'calcado', 'acessorio'] = Field(..., description="Categoria principal")
    subcategoria: str = Field(..., description="Subcategoria específica (ex: camiseta, calca_jeans, tenis, saia, blazer)")
    cor_primaria: str = Field(..., description="Cor dominante em português simples")
    cores_secundarias: List[str] = Field(default_factory=list, description="Cores secundárias ou detalhes")
    estacao: Literal['verao', 'inverno', 'meia_estacao', 'todas'] = Field(..., description="Estação indicada")
    ocasiao_recomendada: Literal['casual', 'trabalho', 'festa', 'esporte'] = Field(..., description="Ocasião principal")
    estilo: str = Field(..., description="Estilo predominante da peça")
    padrao_estampa: Literal['lisa', 'listrada', 'xadrez', 'floral', 'estampada', 'grafica'] = Field(..., description="Padrão do tecido")

class ProcessClothingResponse(BaseModel):
    success: bool
    metadata: ClothingMetadata
    image_nobg_base64: str
    message: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    ai_service: str
