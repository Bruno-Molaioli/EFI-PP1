from pathlib import Path
from sqlmodel import SQLModel, Session, create_engine

# Ruta
BASE_DIR = Path(__file__).parent

# Conexión
DATABASE_URL = f"sqlite:///{BASE_DIR}/repuestos.db"

# Motor
engine = create_engine(DATABASE_URL, echo=True)


# Tablas
def create_tables():
    SQLModel.metadata.create_all(engine)


# Sesión
def get_session():
    with Session(engine) as session:
        yield session
