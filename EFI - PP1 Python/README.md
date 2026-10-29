# Repuestos para Autos y Motos 🔧

**EFI — PP1 Python**

API REST para la gestión de repuestos de vehículos automotores, desarrollada con FastAPI, SQLModel y Alembic.

---

## Integrantes

- Nombre y Apellido
- Nombre y Apellido

---

## Stack Tecnológico

| Herramienta | Rol |
|-------------|-----|
| **FastAPI** | Framework web |
| **SQLModel** | ORM + Schemas |
| **Alembic** | Migraciones |
| **SQLite** | Base de datos local |
| **fastapi-pagination** | Paginación |

---

## Modelos

- **Categoria** — Clasificación de repuestos (Frenos, Motor, Eléctrico, etc.)
- **Proveedor** — Empresa proveedora de los repuestos
- **Producto** — Repuesto con relación a `Categoria` y `Proveedor`

---

## Instalación y uso

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Correr la migración inicial
alembic upgrade head

# 3. Iniciar el servidor
fastapi dev src/main.py
```

La documentación interactiva estará disponible en `http://127.0.0.1:8000/docs`.

---

## Endpoints

| Recurso | Métodos |
|---------|---------|
| `/categorias` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |
| `/proveedores` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |
| `/productos` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |

> Los listados (`GET /`) están **paginados**. Los endpoints por ID devuelven `404` documentado en `/docs`.
