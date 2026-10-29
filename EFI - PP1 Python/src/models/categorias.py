from typing import TYPE_CHECKING, Annotated, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .productos import Producto


# Base
class CategoriaBase(SQLModel):
    nombre: Annotated[
        str,
        Field(min_length=2, max_length=50, description="Nombre de la categoría")
    ]
    descripcion: Annotated[
        str,
        Field(min_length=5, max_length=200, description="Descripción de la categoría")
    ]


# Tabla
class Categoria(CategoriaBase, table=True):
    id: Annotated[Optional[int], Field(default=None, primary_key=True)]

    # Relación inversa
    productos: list["Producto"] = Relationship(back_populates="categoria")


# Respuesta
class CategoriaPublic(CategoriaBase):
    id: int


# Anidado
class CategoriaNested(SQLModel):
    id: int
    nombre: str
