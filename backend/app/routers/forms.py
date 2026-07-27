from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/forms", tags=["forms"])


@router.get("/", response_model=list[schemas.FormListOut])
def list_forms(db: Session = Depends(get_db)):
    return crud.get_forms(db)


@router.post("/", response_model=schemas.FormOut)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    return crud.create_form(db, form)


@router.get("/{form_id}", response_model=schemas.FormOut)
def get_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form


@router.patch("/{form_id}", response_model=schemas.FormOut)
def update_form(form_id: int, form: schemas.FormUpdate, db: Session = Depends(get_db)):
    db_form = crud.update_form(db, form_id, form)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form


@router.delete("/{form_id}")
def delete_form(form_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_form(db, form_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"detail": "Form deleted"}


@router.post("/{form_id}/duplicate", response_model=schemas.FormOut)
def duplicate_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.duplicate_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form


@router.post("/{form_id}/publish", response_model=schemas.FormOut)
def publish_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.publish_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form


@router.post("/{form_id}/unpublish", response_model=schemas.FormOut)
def unpublish_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.unpublish_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form


# ---------- Nested question routes ----------

@router.post("/{form_id}/questions", response_model=schemas.QuestionOut)
def create_question(form_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.create_question(db, form_id, question)


@router.patch("/questions/{question_id}", response_model=schemas.QuestionOut)
def update_question(question_id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.update_question(db, question_id, question)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question


@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_question(db, question_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"detail": "Question deleted"}


@router.put("/{form_id}/questions/reorder", response_model=schemas.FormOut)
def reorder_questions(form_id: int, reorder: schemas.ReorderRequest, db: Session = Depends(get_db)):
    db_form = crud.reorder_questions(db, form_id, reorder)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@router.get("/{form_id}/responses", response_model=list[schemas.ResponseListOut])
def list_responses(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.get_responses(db, form_id)


@router.get("/{form_id}/responses/{response_id}", response_model=schemas.ResponseOut)
def get_response(form_id: int, response_id: int, db: Session = Depends(get_db)):
    db_response = crud.get_response(db, form_id, response_id)
    if not db_response:
        raise HTTPException(status_code=404, detail="Response not found")
    return db_response


@router.delete("/{form_id}/responses/{response_id}")
def delete_response(form_id: int, response_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_response(db, form_id, response_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Response not found")
    return {"detail": "Response deleted"}


@router.get("/{form_id}/summary", response_model=schemas.FormSummaryOut)
def get_summary(form_id: int, db: Session = Depends(get_db)):
    summary = crud.get_form_summary(db, form_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Form not found")
    return summary