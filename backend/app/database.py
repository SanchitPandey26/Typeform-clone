import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from the app directory .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Fall back to local SQLite if DATABASE_URL is not provided
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./typeform.db")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite+libsql"):
    from urllib.parse import urlparse, parse_qs

    parsed = urlparse(SQLALCHEMY_DATABASE_URL.replace("sqlite+libsql://", "https://"))
    params = parse_qs(parsed.query)

    auth_token = params.get("authToken", [None])[0]
    secure = params.get("secure", ["true"])[0].lower() == "true"

    # Rebuild URL keeping secure param (driver reads it from URL) but
    # move authToken to connect_args (SQLAlchemy strips unknown query params)
    clean_url = f"sqlite+libsql://{parsed.hostname}/?secure=true"

    connect_args = {}
    if auth_token:
        connect_args["auth_token"] = auth_token

    engine = create_engine(clean_url, connect_args=connect_args)
else:
    connect_args = {"check_same_thread": False}
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()