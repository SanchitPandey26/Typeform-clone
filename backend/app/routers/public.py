from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/public", tags=["public"])


@router.get("/forms/{slug}", response_model=schemas.PublicFormOut)
def get_public_form(slug: str, db: Session = Depends(get_db)):
    form = crud.get_published_form_by_slug(db, slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or not published")
    return form


@router.post("/forms/{slug}/submit", response_model=schemas.ResponseOut)
def submit_form(slug: str, submission: schemas.ResponseSubmit, db: Session = Depends(get_db)):
    form = crud.get_published_form_by_slug(db, slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or not published")
    return crud.submit_response(db, form, submission)