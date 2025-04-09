from fastapi import FastAPI
# Importa el middleware de CORS
from fastapi.middleware.cors import CORSMiddleware # <--- NUEVO
# Importa el router
from app.routers import cv_upload

app = FastAPI(title="CV Analyzer API - Backend")

# --- Configuración de CORS --- <--- NUEVO BLOQUE
# Lista de orígenes permitidos (tu frontend)
# Para desarrollo, puedes permitir los puertos comunes de React/Vue/etc.
# O usar "*" para permitir todo (menos seguro, ¡solo para desarrollo!)
origins = [
    "http://localhost", # Permitir localhost sin puerto específico
    "http://localhost:3000", # Puerto común para React (Create React App)
    "http://localhost:5173", # Puerto común para React/Vue (Vite)
    # Añade aquí la URL donde corre tu frontend si es diferente
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"], # Métodos permitidos (GET, POST, etc.)
    allow_headers=["*"], # Cabeceras permitidas
)
# --- Fin Configuración de CORS ---

@app.get("/")
async def read_root():
    """ Endpoint raíz para verificar que la API está viva. """
    return {"message": "¡Bienvenido/a a la API de Análisis de CVs!"}

# Incluye las rutas definidas en cv_upload.py
# Asegúrate que el prefijo sea el que espera tu frontend o quítalo si llamas a /cv/analyze directamente
app.include_router(cv_upload.router) # Puedes añadir prefix="/api/v1" si quieres

