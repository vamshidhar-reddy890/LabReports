# Lab Report Intelligence Agent

Full-stack healthcare project that parses PDF lab reports, compares values with medical benchmarks, and generates human-friendly summaries.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, JWT auth, PDFPlumber, LangChain-style retrieval
- Database: MySQL (`lab_agentdb`)
- Frontend: Vanilla HTML/CSS/JS dashboard
- RAG: Local knowledge base + vector retrieval (optional LLM text enhancement with OpenAI key)

## Features
- User modules: register, login, profile, logout
- Dashboard: upload PDF, analyze report, view history, open report details
- Parsing: PDF to structured lab tests (`test_name`, `value`, `unit`)
- Benchmarking: JSON-based medical reference system (gender and age aware)
- Detection: normal/high/low/unknown tagging + risk score
- Summaries: patient-friendly interpretation with reassuring language
- Demo assets: script to generate 2 normal + 2 abnormal sample reports

## Project Structure
```text
backend/
  app/
    config.py
    database.py
    deps.py
    main.py
    models.py
    schemas.py
    security.py
    routes/
    services/
  data/
    benchmarks.json
    medical_knowledge.md
  scripts/
    generate_sample_pdfs.py
  requirements.txt
frontend/
  index.html
  styles.css
  app.js
README.md
```

## Run Locally
1. Create virtual environment and install:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. Optional: copy env file and set values:
```powershell
Copy-Item .env.example .env
```
Set your MySQL credentials in `.env` using:
```env
DATABASE_URL=mysql+pymysql://root@127.0.0.1:3306/lab_agentdb
```
If your MySQL user has a password, use:
`DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@127.0.0.1:3306/lab_agentdb`

3. (Optional) generate sample demo PDFs:
```powershell
python scripts/generate_sample_pdfs.py
```

4. Start server:
```powershell
uvicorn app.main:app --reload
```

5. Open:
- App UI: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`

## API Modules
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `POST /api/reports/upload` (multipart PDF)
- `GET /api/reports`
- `GET /api/reports/{report_id}`
- `GET /api/benchmarks`
- `GET /api/admin/table-counts` (shows counts for `users`, `reports`, `reports_tests`)

## Notes
- This app provides educational summaries and is not a diagnostic tool.
- If `OPENAI_API_KEY` is not set, interpretation uses deterministic fallback text with RAG context.
- In MySQL, confirm tables with:
```sql
USE lab_agentdb;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM reports;
SELECT COUNT(*) FROM reports_tests;
```
