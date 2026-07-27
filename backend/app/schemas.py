from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


# ---------- Question ----------

class QuestionBase(BaseModel):
    type: str
    label: str
    help_text: Optional[str] = None
    required: bool = False
    order_index: int
    options: Optional[list[str]] = None
    settings: Optional[dict[str, Any]] = None


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    label: Optional[str] = None
    help_text: Optional[str] = None
    required: Optional[bool] = None
    order_index: Optional[int] = None
    options: Optional[list[str]] = None
    settings: Optional[dict[str, Any]] = None


class QuestionOut(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    form_id: int


# ---------- Form ----------

class FormBase(BaseModel):
    title: str
    description: Optional[str] = None
    theme: Optional[dict[str, Any]] = None
    thank_you_message: Optional[str] = None


class FormCreate(FormBase):
    pass


class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    theme: Optional[dict[str, Any]] = None
    thank_you_message: Optional[str] = None
    status: Optional[str] = None


class FormListOut(BaseModel):
    """Lightweight version for the dashboard list view."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    status: str
    slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    response_count: int = 0


class FormOut(FormBase):
    """Full version, includes nested questions - used for builder view."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    questions: list[QuestionOut] = []


class ReorderItem(BaseModel):
    id: int
    order_index: int


class ReorderRequest(BaseModel):
    questions: list[ReorderItem]

# ---------- Public respondent flow ----------

class PublicQuestionOut(BaseModel):
    """What a respondent sees - no internal metadata."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    type: str
    label: str
    help_text: Optional[str] = None
    required: bool
    order_index: int
    options: Optional[list[str]] = None
    settings: Optional[dict[str, Any]] = None


class PublicFormOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str] = None
    theme: Optional[dict[str, Any]] = None
    thank_you_message: Optional[str] = None
    questions: list[PublicQuestionOut] = []


class AnswerSubmit(BaseModel):
    question_id: int
    value: Any


class ResponseSubmit(BaseModel):
    answers: list[AnswerSubmit]


class AnswerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question_id: int
    value: Any


class ResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    form_id: int
    submitted_at: Optional[datetime] = None
    completed: bool
    answers: list[AnswerOut] = []


class ResponseListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    submitted_at: Optional[datetime] = None
    completed: bool


class QuestionSummary(BaseModel):
    question_id: int
    label: str
    type: str
    total_answers: int
    breakdown: Optional[dict[str, int]] = None   # for choice/yes_no/rating types


class FormSummaryOut(BaseModel):
    form_id: int
    total_responses: int
    completed_responses: int
    questions: list[QuestionSummary]