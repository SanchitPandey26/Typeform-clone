from datetime import datetime

from .database import Base, engine, SessionLocal
from .models import Form, Question, Response, Answer

def run_seed():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Wipe existing data for a clean reseed
        db.query(Answer).delete()
        db.query(Response).delete()
        db.query(Question).delete()
        db.query(Form).delete()
        db.commit()
    
        # ---------- FORM 1: Customer Feedback ----------
        form1 = Form(
            title="Customer Feedback Survey",
            description="Tell us how we're doing.",
            status="published",
            slug="customer-feedback",
            theme={"color": "#4B7BEC", "font": "Inter", "background": "#FFFFFF"},
            thank_you_message="Thanks a ton for your feedback!",
        )
        db.add(form1)
        db.flush()  # gets form1.id without committing
    
        q1_1 = Question(form_id=form1.id, type="short_text", label="What's your name?",
                         required=True, order_index=0)
        q1_2 = Question(form_id=form1.id, type="email", label="What's your email?",
                         required=True, order_index=1)
        q1_3 = Question(form_id=form1.id, type="multiple_choice", label="How did you hear about us?",
                         options=["Friend", "Social Media", "Search Engine", "Ad"],
                         required=True, order_index=2)
        q1_4 = Question(form_id=form1.id, type="rating", label="Rate your experience",
                         settings={"max_rating": 5}, required=True, order_index=3)
        q1_5 = Question(form_id=form1.id, type="long_text", label="Any additional comments?",
                         required=False, order_index=4)
    
        db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5])
        db.flush()
    
        # A completed response for form1
        r1 = Response(form_id=form1.id, submitted_at=datetime.utcnow(), completed=True)
        db.add(r1)
        db.flush()
    
        db.add_all([
            Answer(response_id=r1.id, question_id=q1_1.id, value="Sanchit Pandey"),
            Answer(response_id=r1.id, question_id=q1_2.id, value="sanchit.pdy@gmail.com"),
            Answer(response_id=r1.id, question_id=q1_3.id, value="Search Engine"),
            Answer(response_id=r1.id, question_id=q1_4.id, value=5),
            Answer(response_id=r1.id, question_id=q1_5.id, value="Great support experience!"),
        ])
    
        # ---------- FORM 2: Job Application Intake ----------
        form2 = Form(
            title="Job Application Intake",
            description="Quick intake form for new applicants.",
            status="published",
            slug="job-application",
            theme={"color": "#1E1E1E", "font": "Inter", "background": "#F5F5F5"},
            thank_you_message="We'll be in touch soon!",
        )
        db.add(form2)
        db.flush()
    
        q2_1 = Question(form_id=form2.id, type="short_text", label="Full name",
                         required=True, order_index=0)
        q2_2 = Question(form_id=form2.id, type="number", label="Years of experience",
                         required=True, order_index=1)
        q2_3 = Question(form_id=form2.id, type="dropdown", label="Preferred role",
                         options=["Frontend", "Backend", "Fullstack"],
                         required=True, order_index=2)
        q2_4 = Question(form_id=form2.id, type="yes_no", label="Are you open to relocation?",
                         required=True, order_index=3)
    
        db.add_all([q2_1, q2_2, q2_3, q2_4])
        db.flush()
    
        r2 = Response(form_id=form2.id, submitted_at=datetime.utcnow(), completed=True)
        db.add(r2)
        db.flush()
    
        db.add_all([
            Answer(response_id=r2.id, question_id=q2_1.id, value="Test Applicant"),
            Answer(response_id=r2.id, question_id=q2_2.id, value=3),
            Answer(response_id=r2.id, question_id=q2_3.id, value="Fullstack"),
            Answer(response_id=r2.id, question_id=q2_4.id, value=True),
        ])
    
        db.commit()
        print("Database seeded successfully.")
    
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()