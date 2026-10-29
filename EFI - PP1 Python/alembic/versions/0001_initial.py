"""Migración inicial: crea las tablas categoria, proveedor y producto

Revision ID: 0001
Revises: 
Create Date: 2026-10-22

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# Identificadores
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Categorías
    op.create_table(
        "categoria",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(), nullable=False),
        sa.Column("descripcion", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # Proveedores
    op.create_table(
        "proveedor",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(), nullable=False),
        sa.Column("telefono", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # Productos
    op.create_table(
        "producto",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(), nullable=False),
        sa.Column("descripcion", sa.String(), nullable=False),
        sa.Column("precio", sa.Float(), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False),
        sa.Column("compatibilidad", sa.String(), nullable=False),
        sa.Column("categoria_id", sa.Integer(), nullable=True),
        sa.Column("proveedor_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["categoria_id"], ["categoria.id"]),
        sa.ForeignKeyConstraint(["proveedor_id"], ["proveedor.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    # Invertido
    op.drop_table("producto")
    op.drop_table("proveedor")
    op.drop_table("categoria")
