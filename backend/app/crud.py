import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from fastapi import HTTPException
from . import models, schemas

# ---------- Forms ----------

def get_forms(db: Session):
    forms = db.query(models.Form).order_by(models.Form.updated_at.desc()).all()
    result = []
    for f in forms:
        count = db.query(func.count(models.Response.id)).filter(
            models.Response.form_id == f.id, models.Response.completed == True
        ).scalar()
        result.append(
            schemas.FormListOut(
                id=f.id, title=f.title, status=f.status, slug=f.slug,
                created_at=f.created_at, updated_at=f.updated_at,
                response_count=count,
            )
        )
    return result


def get_form(db: Session, form_id: int):
    return db.query(models.Form).filter(models.Form.id == form_id).first()


def create_form(db: Session, form: schemas.FormCreate):
    db_form = models.Form(**form.model_dump())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form


def update_form(db: Session, form_id: int, form: schemas.FormUpdate):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    for key, value in form.model_dump(exclude_unset=True).items():
        setattr(db_form, key, value)
    db.commit()
    db.refresh(db_form)
    return db_form


def delete_form(db: Session, form_id: int):
    db_form = get_form(db, form_id)
    if not db_form:
        return False
    db.delete(db_form)
    db.commit()
    return True


def duplicate_form(db: Session, form_id: int):
    original = get_form(db, form_id)
    if not original:
        return None

    new_form = models.Form(
        title=f"{original.title} (Copy)",
        description=original.description,
        status="draft",
        slug=None,
        theme=original.theme,
        thank_you_message=original.thank_you_message,
    )
    db.add(new_form)
    db.flush()

    for q in original.questions:
        db.add(models.Question(
            form_id=new_form.id, type=q.type, label=q.label,
            help_text=q.help_text, required=q.required,
            order_index=q.order_index, options=q.options, settings=q.settings,
        ))

    db.commit()
    db.refresh(new_form)
    return new_form


def publish_form(db: Session, form_id: int):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    db_form.status = "published"
    if not db_form.slug:
        db_form.slug = f"{db_form.title.lower().replace(' ', '-')[:40]}-{uuid.uuid4().hex[:6]}"
    db.commit()
    db.refresh(db_form)
    return db_form


def unpublish_form(db: Session, form_id: int):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    db_form.status = "draft"
    db.commit()
    db.refresh(db_form)
    return db_form


# ---------- Questions ----------

def create_question(db: Session, form_id: int, question: schemas.QuestionCreate):
    db_question = models.Question(form_id=form_id, **question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def update_question(db: Session, question_id: int, question: schemas.QuestionUpdate):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        return None
    for key, value in question.model_dump(exclude_unset=True).items():
        setattr(db_question, key, value)
    db.commit()
    db.refresh(db_question)
    return db_question


def delete_question(db: Session, question_id: int):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        return False
    db.delete(db_question)
    db.commit()
    return True


def reorder_questions(db: Session, form_id: int, reorder: schemas.ReorderRequest):
    for item in reorder.questions:
        db.query(models.Question).filter(
            models.Question.id == item.id, models.Question.form_id == form_id
        ).update({"order_index": item.order_index})
    db.commit()
    return get_form(db, form_id)

# ---------- Public respondent flow ----------

def get_published_form_by_slug(db: Session, slug: str):
    form = db.query(models.Form).filter(
        models.Form.slug == slug, models.Form.status == "published"
    ).first()
    return form


def _validate_answer(question: models.Question, value):
    """Server-side validation mirroring what the frontend checks client-side."""
    if question.required and (value is None or value == "" or value == []):
        raise HTTPException(
            status_code=422, detail=f"'{question.label}' is required"
        )

    if value is None or value == "":
        return  # optional + empty, nothing more to check

    if question.type == "email":
        if "@" not in str(value) or "." not in str(value).split("@")[-1]:
            raise HTTPException(status_code=422, detail=f"'{question.label}' must be a valid email")

    elif question.type == "number":
        try:
            float(value)
        except (TypeError, ValueError):
            raise HTTPException(status_code=422, detail=f"'{question.label}' must be a number")

    elif question.type in ("multiple_choice", "dropdown"):
        if question.options and value not in question.options:
            raise HTTPException(status_code=422, detail=f"'{question.label}' has an invalid option")

    elif question.type == "yes_no":
        if not isinstance(value, bool):
            raise HTTPException(status_code=422, detail=f"'{question.label}' must be true or false")

    elif question.type == "rating":
        max_rating = (question.settings or {}).get("max_rating", 5)
        try:
            rating_val = int(value)
        except (TypeError, ValueError):
            raise HTTPException(status_code=422, detail=f"'{question.label}' must be a number")
        if not (1 <= rating_val <= max_rating):
            raise HTTPException(status_code=422, detail=f"'{question.label}' must be between 1 and {max_rating}")


def submit_response(db: Session, form: models.Form, submission: schemas.ResponseSubmit):
    answers_by_qid = {a.question_id: a.value for a in submission.answers}

    # Validate every question on the form, not just the ones submitted
    for question in form.questions:
        _validate_answer(question, answers_by_qid.get(question.id))

    db_response = models.Response(
        form_id=form.id, submitted_at=datetime.utcnow(), completed=True
    )
    db.add(db_response)
    db.flush()

    for a in submission.answers:
        db.add(models.Answer(
            response_id=db_response.id, question_id=a.question_id, value=a.value
        ))

    db.commit()
    db.refresh(db_response)
    return db_response


# ---------- Results / responses ----------

def get_responses(db: Session, form_id: int):
    return db.query(models.Response).filter(
        models.Response.form_id == form_id, models.Response.completed == True
    ).order_by(models.Response.submitted_at.desc()).all()


def get_response(db: Session, form_id: int, response_id: int):
    return db.query(models.Response).filter(
        models.Response.id == response_id, models.Response.form_id == form_id
    ).first()


def delete_response(db: Session, form_id: int, response_id: int):
    response = get_response(db, form_id, response_id)
    if response:
        db.delete(response)
        db.commit()
        return True
    return False


def get_form_summary(db: Session, form_id: int):
    form = get_form(db, form_id)
    if not form:
        return None

    all_responses = db.query(models.Response).filter(models.Response.form_id == form_id).all()
    completed = [r for r in all_responses if r.completed]

    question_summaries = []
    for q in form.questions:
        answers = db.query(models.Answer).filter(models.Answer.question_id == q.id).all()
        summary = schemas.QuestionSummary(
            question_id=q.id, label=q.label, type=q.type,
            total_answers=len(answers), breakdown=None,
        )

        if q.type in ("multiple_choice", "dropdown", "yes_no", "rating"):
            breakdown: dict[str, int] = {}
            for a in answers:
                key = str(a.value)
                breakdown[key] = breakdown.get(key, 0) + 1
            summary.breakdown = breakdown

        question_summaries.append(summary)

    return schemas.FormSummaryOut(
        form_id=form_id,
        total_responses=len(all_responses),
        completed_responses=len(completed),
        questions=question_summaries,
    )