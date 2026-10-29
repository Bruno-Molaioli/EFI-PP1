from enum import Enum
from typing import Annotated, Optional

from sqlmodel import Field, Relationship, SQLModel

from .categorias import Categoria, CategoriaNested
from .proveedores import Proveedor, ProveedorNested


# Opciones
class Compatibilidad(str, Enum):
    autos = "Autos"
    motos = "Motos"
    ambos = "Ambos"


# Base
class ProductoBase(SQLModel):
    nombre: Annotated[
        str,
        Field(min_length=2, max_length=100, description="Nombre del repuesto")
    ]
    descripcion: Annotated[
        str,
        Field(min_length=5, max_length=300, description="Descripción del repuesto")
    ]
    precio: Annotated[
        float,
        Field(gt=0, description="Precio en pesos")
    ]
    stock: Annotated[
        int,
        Field(ge=0, description="Cantidad en stock")
    ]
    compatibilidad: Annotated[
        Compatibilidad,
        Field(description="Tipo de vehículo compatible")
    ]

    # Foráneas
    categoria_id: Annotated[
        Optional[int],
        Field(default=None, foreign_key="categoria.id", description="ID de la categoría")
    ]
    proveedor_id: Annotated[
        Optional[int],
        Field(default=None, foreign_key="proveedor.id", description="ID del proveedor")
    ]


# Tabla
class Producto(ProductoBase, table=True):
    id: Annotated[Optional[int], Field(default=None, primary_key=True)]

    # Relaciones
    categoria: Optional[Categoria] = Relationship(back_populates="productos")
    proveedor: Optional[Proveedor] = Relationship(back_populates="productos")


# Respuesta con anidamiento
class ProductoPublic(ProductoBase):
    id: int
    categoria: Optional[CategoriaNested] = None
    proveedor: Optional[ProveedorNested] = None
