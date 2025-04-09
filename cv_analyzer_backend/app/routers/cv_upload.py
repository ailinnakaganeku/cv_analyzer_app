from fastapi import APIRouter, UploadFile, File, HTTPException, status
import shutil
import os
# Importa SOLO la nueva función del servicio
from app.services.analysis_service import parse_cv_with_apilayer # <--- MODIFICADO

router = APIRouter(
    prefix="/cv",
    tags=["CV Parser (APILayer)"], # Tag actualizado
)

UPLOAD_DIRECTORY = "./temp_uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/parse", status_code=status.HTTP_200_OK) # Cambiamos ruta a /parse
async def parse_cv_endpoint(cv_file: UploadFile = File(...)):
    """
    Endpoint to upload CV and parse it using APILayer API.
    """
    allowed_mime_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    # Podríamos añadir .doc si la API lo soporta según su docu
    if cv_file.content_type not in allowed_mime_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid file type...")

    file_location = os.path.join(UPLOAD_DIRECTORY, cv_file.filename)
    api_result = {}

    try:
        # Guarda archivo temporalmente
        with open(file_location, "wb") as buffer:
             shutil.copyfileobj(cv_file.file, buffer)
        print(f"File '{cv_file.filename}' saved temporarily...")

        # --- Llama a la función que usa la API Externa ---
        api_result = await parse_cv_with_apilayer(file_location)

        # Si la API devolvió un error interno, lo pasamos al frontend
        if isinstance(api_result, dict) and api_result.get("error"):
             print(f"Returning API error to client: {api_result['error']}")
             # Podríamos devolver un código 502 Bad Gateway si la API externa falla
             # O mantener 200 OK pero con el error en el cuerpo
             # Por simplicidad MVP, devolvemos 200 con el error dentro

    except Exception as e:
        # Captura errores ANTES de llamar a la API o errores inesperados
        print(f"CRITICAL ERROR in parse_cv_endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file before API call: {e}"
        )
    finally:
        # Borrar archivo temporal
        await cv_file.close()
        if os.path.exists(file_location):
            try: os.remove(file_location); print(f"Temporary file '{file_location}' deleted.")
            except Exception as e_del: print(f"Error deleting temp file '{file_location}': {e_del}")

    # Devuelve directamente lo que la API de APILayer retornó (o el error)
    return api_result if api_result else {"error": "Unknown error during parsing"}