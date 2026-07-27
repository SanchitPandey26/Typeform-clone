from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import forms, public

app = FastAPI(title="Typeform Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms.router)
app.include_router(public.router)


@app.get("/")
def root():
    return {"status": "ok"}