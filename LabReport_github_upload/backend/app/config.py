from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = BACKEND_ROOT / ".env"


class Settings(BaseSettings):
    app_name: str = "Lab Report Intelligence Agent"
    jwt_secret_key: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 8
    base_dir: str = "."
    database_url: str = "mysql+pymysql://root@127.0.0.1:3306/lab_agentdb"
    upload_dir: str = "uploads"
    benchmark_path: str = "data/benchmarks.json"
    knowledge_base_path: str = "data/medical_knowledge.md"
    openai_api_key: str | None = None
    translation_api_url: str = "https://libretranslate.com/translate"
    translation_api_key: str | None = None
    translation_api_timeout_seconds: int = 12

    model_config = SettingsConfigDict(env_file=str(ENV_FILE), extra="ignore")


settings = Settings()


def resolve_path(path: str) -> str:
    from pathlib import Path

    p = Path(path)
    if p.is_absolute():
        return str(p)
    backend_root = Path(__file__).resolve().parents[1]
    return str((backend_root / p).resolve())
