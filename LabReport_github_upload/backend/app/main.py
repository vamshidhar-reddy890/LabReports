from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text

from app.config import resolve_path, settings
from app.database import Base, engine
from app.routes import admin, auth, benchmarks, engagement, reports, system, translate, users

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def ensure_optional_user_columns():
    inspector = inspect(engine)
    columns = {col["name"] for col in inspector.get_columns("users")}
    if "demo_password_hint" not in columns:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN demo_password_hint VARCHAR(255) NULL"))


def ensure_optional_contact_columns():
    inspector = inspect(engine)
    if "contact_messages" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("contact_messages")}
    with engine.begin() as conn:
        if "name" not in columns:
            conn.execute(text("ALTER TABLE contact_messages ADD COLUMN name VARCHAR(150) NULL"))
        if "contact_number" not in columns:
            conn.execute(text("ALTER TABLE contact_messages ADD COLUMN contact_number VARCHAR(25) NULL"))


ensure_optional_user_columns()
ensure_optional_contact_columns()
Path(resolve_path(settings.upload_dir)).mkdir(parents=True, exist_ok=True)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(benchmarks.router)
app.include_router(admin.router)
app.include_router(engagement.router)
app.include_router(translate.router)
app.include_router(system.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


frontend_dist_dir = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if frontend_dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist_dir), html=True), name="frontend")
