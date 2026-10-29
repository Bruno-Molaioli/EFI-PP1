from typing import TYPE_CHECKING, Annotated, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .productos import Producto


# Base
class ProveedorBase(SQLModel):
    nombre: Annotated[
        str,
        Field(min_length=2, max_length=100, description="Nombre del proveedor")
    ]
    telefono: Annotated[
        str,
        Field(min_length=7, max_length=20, description="Teléfono de contacto")
    ]
    email: Annotated[
        str,
        Field(min_length=5, max_length=100, description="Email de contacto")
    ]


# Tabla
class Proveedor(ProveedorBase, table=True):
    id: Annotated[Optional[int], Field(default=None, primary_key=True)]

    # Relación inversa
    productos: list["Producto"] = Relationship(back_populates="proveedor")


# Respuesta
class ProveedorPublic(ProveedorBase):
    id: int


# Anidado
class ProveedorNested(SQLModel):
    id: int
    nombre: str
    email: str
