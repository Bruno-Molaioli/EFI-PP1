from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

from database import create_tables
from routers import categorias, productos, proveedores


# Inicio
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


# App
app = FastAPI(
    title="Repuestos para Autos y Motos",
    description="API para la gestión de repuestos de vehículos automotores.",
    lifespan=lifespan
)

# Orígenes
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(categorias.router, prefix="/categorias", tags=["Categorías"])
app.include_router(proveedores.router, prefix="/proveedores", tags=["Proveedores"])
app.include_router(productos.router, prefix="/productos", tags=["Productos"])

# Paginación
add_pagination(app)
