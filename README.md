# Typeform Clone

A full-stack, functional clone of the Typeform application that replicates Typeform's design, user experience, and core form-building and form-filling workflows.

## 🚀 Features

- **Form Builder**: A drag-and-drop builder with a live preview. Supports multiple question types (short text, long text, multiple choice, dropdown, email, number, yes/no, rating) with required toggles and descriptions.
- **Form Management**: Dashboard to list, create, rename, duplicate, publish, and delete forms. 
- **Respondent Flow**: The signature one-question-at-a-time Typeform experience. Features full-screen UI, smooth animations, and full keyboard navigation (Enter / Arrow keys).
- **Responses & Results**: View basic summary statistics, individual responses in full detail via a slide-over panel, and export your responses to CSV.

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion (for transitions), Lucide React (icons), and Axios.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy (ORM), and Pydantic (data validation).
- **Database**: SQLite (local lightweight database).

## 🏛️ Architecture Overview

The application follows a standard separated client-server architecture:
- **Frontend (Client)**: Built with Next.js App Router for modern React features. State is managed locally within components (and passed down) to keep it fast and responsive. `framer-motion` handles the complex view transitions in the respondent flow.
- **Backend (API)**: Built with FastAPI for high performance and automatic interactive API documentation. The routing is strictly RESTful, split into `forms.py` (CRUD operations) and `public.py` (responses/submissions).
- **Database (SQLite)**: Used for persistent storage, interacted with entirely through SQLAlchemy ORM to prevent SQL injection and allow easy schema migrations if needed.

## 🗄️ Database Schema

The database relies on three core entities:
1. **Forms**: `id`, `slug` (unique for public URLs), `title`, `status` (draft/published), `thank_you_message`, `created_at`, `updated_at`.
2. **Questions**: `id`, `form_id` (foreign key), `type`, `label`, `help_text`, `required`, `order_index`, `options` (JSON for choices), `settings` (JSON for things like max rating).
3. **Responses**: `id`, `form_id` (foreign key), `submitted_at`, `completed` (boolean tracking if the user reached the end).
4. **Answers**: `id`, `response_id` (foreign key), `question_id` (foreign key), `value` (JSON).

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone <repository_url>
cd Typeform-clone
```

### 2. Backend Setup
Navigate to the backend directory, set up a virtual environment, and run the FastAPI server:
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run the database seed to get dummy data!
python -m app.seed

# Start the server
uvicorn app.main:app --reload
```
*The API will be running at http://localhost:8000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and run the development server:
```bash
cd frontend
npm install
npm run dev
```
*The app will be running at http://localhost:3000*

## 🤔 Assumptions & Simplifications

- **Authentication**: As per the instructions, advanced creator authentication is mocked. We assume a default logged-in creator.
- **Respondent Tracking**: No login is required to submit a form. Partial responses are tracked by creating a Response row immediately upon form load and updating it dynamically. 
- **Contact Info Group**: Rather than implementing complex nested question groups (like Typeform's Contact Info block), the schema keeps it simple: flat questions. Contact forms are just multiple consecutive standard questions (First Name, Email, etc.).
- **Themes & Logic Jumps**: Handled via simple UI placeholders as specified by the "mocked sections" assignment allowances.
