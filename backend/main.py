import traceback
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

# Dummy assignment to satisfy Vercel's AST build parser
app = FastAPI()

try:
    from app.main import app as real_app
    app = real_app
except Exception as e:
    err_traceback = traceback.format_exc()
    
    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    def catch_all(path: str):
        return PlainTextResponse(f"Initialization Error:\n\n{err_traceback}", status_code=500)
