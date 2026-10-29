from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from database import get_session
from models.categorias import Categoria, CategoriaBase, CategoriaPublic

# Instancia
router = APIRouter()


@router.post("/", response_model=CategoriaPublic, status_code=201)
def crear_categoria(categoria: CategoriaBase, session: Session = Depends(get_session)):
    """Crea una nueva categoría de repuestos."""
    # Nuevo registro
    nueva = Categoria.model_validate(categoria)
    session.add(nueva)
    session.commit()
    session.refresh(nueva)
    return nueva


@router.get("/", response_model=Page[CategoriaPublic])
def obtener_categorias(session: Session = Depends(get_session)):
    """Retorna todas las categorías paginadas."""
    return paginate(session, select(Categoria))


@router.get(
    "/{id_categoria}",
    response_model=CategoriaPublic,
    responses={404: {"description": "Categoría no encontrada"}}
)
def obtener_categoria(
    id_categoria: Annotated[int, Path(gt=0, description="ID de la categoría")],
    session: Session = Depends(get_session)
):
    """Retorna una categoría por su ID."""
    categoria = session.get(Categoria, id_categoria)

    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    return categoria


@router.put(
    "/{id_categoria}",
    response_model=CategoriaPublic,
    responses={404: {"description": "Categoría no encontrada"}}
)
def editar_categoria(
    id_categoria: Annotated[int, Path(gt=0)],
    datos: CategoriaBase,
    session: Session = Depends(get_session)
):
    """Actualiza una categoría existente."""
    categoria = session.get(Categoria, id_categoria)

    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Actualizar campos
    for campo, valor in datos.model_dump().items():
        setattr(categoria, campo, valor)

    session.commit()
    session.refresh(categoria)
    return categoria


@router.delete(
    "/{id_categoria}",
    response_model=CategoriaPublic,
    responses={404: {"description": "Categoría no encontrada"}}
)
def eliminar_categoria(
    id_categoria: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_session)
):
    """Elimina una categoría por su ID."""
    categoria = session.get(Categoria, id_categoria)

    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    session.delete(categoria)
    session.commit()
    return categoria
