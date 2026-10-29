from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from database import get_session
from models.proveedores import Proveedor, ProveedorBase, ProveedorPublic

# Instancia
router = APIRouter()


@router.post("/", response_model=ProveedorPublic, status_code=201)
def crear_proveedor(proveedor: ProveedorBase, session: Session = Depends(get_session)):
    """Crea un nuevo proveedor de repuestos."""
    # Nuevo registro
    nuevo = Proveedor.model_validate(proveedor)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo


@router.get("/", response_model=Page[ProveedorPublic])
def obtener_proveedores(session: Session = Depends(get_session)):
    """Retorna todos los proveedores paginados."""
    return paginate(session, select(Proveedor))


@router.get(
    "/{id_proveedor}",
    response_model=ProveedorPublic,
    responses={404: {"description": "Proveedor no encontrado"}}
)
def obtener_proveedor(
    id_proveedor: Annotated[int, Path(gt=0, description="ID del proveedor")],
    session: Session = Depends(get_session)
):
    """Retorna un proveedor por su ID."""
    proveedor = session.get(Proveedor, id_proveedor)

    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    return proveedor


@router.put(
    "/{id_proveedor}",
    response_model=ProveedorPublic,
    responses={404: {"description": "Proveedor no encontrado"}}
)
def editar_proveedor(
    id_proveedor: Annotated[int, Path(gt=0)],
    datos: ProveedorBase,
    session: Session = Depends(get_session)
):
    """Actualiza un proveedor existente."""
    proveedor = session.get(Proveedor, id_proveedor)

    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    # Actualizar campos
    for campo, valor in datos.model_dump().items():
        setattr(proveedor, campo, valor)

    session.commit()
    session.refresh(proveedor)
    return proveedor


@router.delete(
    "/{id_proveedor}",
    response_model=ProveedorPublic,
    responses={404: {"description": "Proveedor no encontrado"}}
)
def eliminar_proveedor(
    id_proveedor: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_session)
):
    """Elimina un proveedor por su ID."""
    proveedor = session.get(Proveedor, id_proveedor)

    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    session.delete(proveedor)
    session.commit()
    return proveedor
