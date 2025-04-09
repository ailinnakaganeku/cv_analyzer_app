import os
import httpx # Importa la librería HTTP
from typing import Optional, Dict, Any

# Ya no necesitamos fitz, docx, re, etc., aquí si solo usamos la API externa

# --- Función para llamar a APILayer (CORREGIDA - Envío de datos) ---
async def parse_cv_with_apilayer(file_path: str) -> Optional[Dict[str, Any]]:
    """
    Llama a la API de APILayer Resume Parser para analizar un CV,
    enviando el archivo como application/octet-stream.

    Args:
        file_path: Ruta al archivo CV guardado temporalmente.

    Returns:
        Diccionario con los datos parseados por la API, o un dict con error si falla.
    """
    api_key = os.environ.get("APILAYER_API_KEY")
    if not api_key:
        print("ERROR: APILAYER_API_KEY environment variable not set.")
        return {"error": "API Key for APILayer not configured."}

    api_url = "https://api.apilayer.com/resume_parser/upload"
    # Cabeceras: Incluir apikey Y el Content-Type correcto para upload
    headers = {
        "apikey": api_key,
        "Content-Type": "application/octet-stream" # <-- Cabecera clave según docu
    }

    try:
        # Leer el contenido completo del archivo en bytes
        with open(file_path, "rb") as f:
            file_content = f.read()

        # Usar httpx para hacer la llamada asíncrona
        async with httpx.AsyncClient() as client:
            print(f"Calling APILayer API (upload endpoint) for file: {os.path.basename(file_path)} with correct Content-Type")
            response = await client.post(
                api_url,
                headers=headers,
                content=file_content, # <-- Envía los bytes directamente usando 'content'
                timeout=45.0 # Aumentamos timeout por si API tarda
            )

        response.raise_for_status() # Lanza excepción si la respuesta es 4xx o 5xx

        parsed_data = response.json()
        print("APILayer API call successful. Parsed data received.")
        # print(parsed_data) # Descomenta si quieres ver el JSON completo en el log
        return parsed_data # Devuelve el JSON parseado

    except httpx.HTTPStatusError as e:
        # Error de respuesta HTTP (4xx, 5xx)
        error_detail = e.response.text
        try: error_json = e.response.json(); error_detail = error_json.get("message", e.response.text)
        except Exception: pass
        print(f"APILayer API Error: Status {e.response.status_code} - {error_detail}")
        return {"error": f"API Error ({e.response.status_code}): {error_detail}"}
    except httpx.RequestError as e:
        # Error de conexión, timeout, etc.
        print(f"APILayer API Request Error: {e}")
        return {"error": f"Could not connect to API: {e}"}
    except Exception as e:
        # Otros errores inesperados
        print(f"Unexpected error calling APILayer: {e}")
        return {"error": f"Unexpected error during API call: {e}"}

# --- Las otras funciones de análisis ya no existen en este archivo ---