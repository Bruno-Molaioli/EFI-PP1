from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlmodel import paginate
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from database import get_session
from models.productos import Producto, ProductoBase, ProductoPublic

# Instancia
router = APIRouter()


@router.post("/", response_model=ProductoPublic, status_code=201)
def crear_producto(producto: ProductoBase, session: Session = Depends(get_session)):
    """Crea un nuevo producto/repuesto."""
    # Nuevo registro
    nuevo = Producto.model_validate(producto)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo


@router.get("/", response_model=Page[ProductoPublic])
def obtener_productos(session: Session = Depends(get_session)):
    """Retorna todos los productos paginados con sus relaciones."""
    # Eager loading
    statement = select(Producto).options(
        selectinload(Producto.categoria),
        selectinload(Producto.proveedor)
    )
    return paginate(session, statement)


@router.get(
    "/{id_producto}",
    response_model=ProductoPublic,
    responses={404: {"description": "Producto no encontrado"}}
)
def obtener_producto(
    id_producto: Annotated[int, Path(gt=0, description="ID del producto")],
    session: Session = Depends(get_session)
):
    """Retorna un producto por su ID con sus relaciones."""
    # Eager loading
    statement = (
        select(Producto)
        .where(Producto.id == id_producto)
        .options(
            selectinload(Producto.categoria),
            selectinload(Producto.proveedor)
        )
    )
    producto = session.exec(statement).first()

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return producto


@router.put(
    "/{id_producto}",
    response_model=ProductoPublic,
    responses={404: {"description": "Producto no encontrado"}}
)
def editar_producto(
    id_producto: Annotated[int, Path(gt=0)],
    datos: ProductoBase,
    session: Session = Depends(get_session)
):
    """Actualiza un producto existente."""
    producto = session.get(Producto, id_producto)

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Actualizar campos
    for campo, valor in datos.model_dump().items():
        setattr(producto, campo, valor)

    session.commit()
    session.refresh(producto)
    return producto


@router.delete(
    "/{id_producto}",
    response_model=ProductoPublic,
    responses={404: {"description": "Producto no encontrado"}}
)
def eliminar_producto(
    id_producto: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_session)
):
    """Elimina un producto por su ID."""
    producto = session.get(Producto, id_producto)

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    session.delete(producto)
    session.commit()
    return producto
