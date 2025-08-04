import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    TRINO_HOST: str = os.getenv("TRINO_HOST", "localhost")
    TRINO_PORT: int = int(os.getenv("TRINO_PORT", 8080))
    TRINO_USER: str = os.getenv("TRINO_USER", "admin")
    TRINO_CATALOG: str = os.getenv("TRINO_CATALOG", "icebergrest")


    TRINO_HOST: str = "trino.1digitalstack.com"
    TRINO_PORT: int = 8080
    TRINO_USER: str = "nakul_1ds"

    class Config:
        env_file = ".env"

settings = Settings()

