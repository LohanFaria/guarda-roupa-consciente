import os
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env (da raiz ou da pasta backend)
load_dotenv()
load_dotenv(dotenv_path="../.env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
