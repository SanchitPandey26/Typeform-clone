from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="draft", nullable=False)   # "draft" | "published"
    slug = Column(String, unique=True, index=True, nullable=True)
    theme = Column(JSON, nullable=True)                         # {color, font, background}
    thank_you_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    questions = relationship(
        "Question", back_populates="form",
        cascade="all, delete-orphan", order_by="Question.order_index"
    )
    responses = relationship(
        "Response", back_populates="form",
        cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    type = Column(String, nullable=False)
    # "short_text" | "long_text" | "multiple_choice" | "dropdown"
    # | "email" | "number" | "yes_no" | "rating"
    label = Column(String, nullable=False)
    help_text = Column(String, nullable=True)
    required = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, nullable=False)
    options = Column(JSON, nullable=True)     # e.g. ["Red", "Blue", "Green"]
    settings = Column(JSON, nullable=True)    # e.g. {"max_rating": 5}

    form = relationship("Form", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)

    form = relationship("Form", back_populates="responses")
    answers = relationship("Answer", back_populates="response", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    value = Column(JSON, nullable=True)   # stores string, number, bool, or list depending on type

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")