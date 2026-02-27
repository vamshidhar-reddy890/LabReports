from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


def ensure_mysql_database_exists(database_url: str):
    if not database_url.startswith("mysql+pymysql://"):
        return
    url = make_url(database_url)
    db_name = url.database
    if not db_name:
        return
    try:
        import pymysql
    except Exception as exc:
        raise RuntimeError("pymysql is required for MySQL connections. Install it with `pip install pymysql`.") from exc

    connection = pymysql.connect(
        host=url.host or "127.0.0.1",
        port=url.port or 3306,
        user=url.username or "root",
        password=url.password or "",
        autocommit=True,
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    finally:
        connection.close()


ensure_mysql_database_exists(settings.database_url)
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
