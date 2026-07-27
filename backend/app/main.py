from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import forms, public

import os

app = FastAPI(title="Typeform Clone API")

# Allow configuring CORS via environment variable, supporting multiple comma-separated URLs
frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [url.strip() for url in frontend_urls.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms.router)
app.include_router(public.router)


@app.get("/")
def root():
    return {"status": "ok"}