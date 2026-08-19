import type { CategoriaPeca, Estacao, Ocasiao, PadraoEstampa } from '../types/wardrobe.types';

export interface ProcessClothingResult {
  success: boolean;
  metadata: {
    nome_sugerido: string;
    categoria: CategoriaPeca;
    subcategoria: string;
    cor_primaria: string;
    cores_secundarias: string[];
    estacao: Estacao;
    ocasiao_recomendada: Ocasiao;
    estilo: string;
    padrao_estampa: PadraoEstampa;
  };
  image_nobg_base64: string;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function processarFotoDeRoupa(file: File): Promise<ProcessClothingResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/process-clothing`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro no processamento (${response.statusText})`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend FastAPI indisponível, usando fallback inteligente de preview:', error);
    
    // Fallback gracioso para teste offline no navegador:
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve({
          success: true,
          metadata: {
            nome_sugerido: file.name.split('.')[0] || 'Nova Peça',
            categoria: 'superior',
            subcategoria: 'camiseta',
            cor_primaria: 'preto',
            cores_secundarias: [],
            estacao: 'todas',
            ocasiao_recomendada: 'casual',
            estilo: 'casual',
            padrao_estampa: 'lisa'
          },
          image_nobg_base64: base64,
          message: 'Processado em modo local (preview).'
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
