# 🐍 ¿Cómo funciona la API? — EFI PP1 Python

## El punto de entrada: `src/main.py`

Todo arranca acá. Es el **primer archivo que se ejecuta** cuando corrés:

```bash
fastapi dev src/main.py
```

Lo que hace ese archivo, en orden:

```
1. Crea la app de FastAPI con título y descripción
2. Al iniciar, llama a create_tables() → genera las tablas en SQLite si no existen
3. Configura CORS → le dice "aceptá pedidos del navegador que corre en localhost:5173"
4. Registra los 3 routers → /categorias, /proveedores, /productos
5. Activa la paginación → los GET de listados devuelven { items, total, page, size }
```

---

## El viaje completo de un pedido HTTP

Tomemos como ejemplo: **el frontend quiere ver todos los productos**.

```
NAVEGADOR (React)
      │
      │  GET http://127.0.0.1:8000/productos/?size=50
      │
      ▼
src/main.py
  └── app.include_router(productos.router, prefix="/productos")
      │
      │  FastAPI busca la ruta GET "/" dentro del router de productos
      │
      ▼
src/routers/productos.py  ← función obtener_productos()
  └── Recibe una Session de la base de datos (via Depends)
  └── Ejecuta: select(Producto).options(selectinload(...))
  └── Llama a paginate(session, statement)
      │
      ▼
src/models/productos.py   ← SQLModel lee la tabla "producto" de SQLite
  └── Devuelve una lista de objetos Producto
      │
      ▼
FastAPI serializa los objetos usando ProductoPublic
  └── Incluye CategoriaNested y ProveedorNested anidados
      │
      ▼
RESPUESTA JSON al navegador:
{
  "items": [ { "id": 1, "nombre": "Pastilla de freno", "precio": 15000, ... } ],
  "total": 5,
  "page": 1,
  "size": 50
}
```

---

## Las 3 capas del proyecto

```
┌──────────────────────────────────────────────────────┐
│  ROUTERS  (src/routers/)                             │
│  Reciben el pedido HTTP, validan datos de entrada    │
│  y devuelven la respuesta. Son los "controladores".  │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────┐ │
│  │ categorias   │  │  proveedores  │  │ productos │ │
│  └──────────────┘  └───────────────┘  └───────────┘ │
├──────────────────────────────────────────────────────┤
│  MODELS  (src/models/)                               │
│  Definen la estructura de los datos y los schemas    │
│  de validación. Son las "clases".                    │
│                                                      │
│  Cada archivo tiene 4 clases:                        │
│  • XxxBase    → campos comunes (nombre, precio...)   │
│  • Xxx        → la tabla real en SQLite (table=True) │
│  • XxxPublic  → lo que se devuelve en la respuesta   │
│  • XxxNested  → versión reducida para anidar en otro │
├──────────────────────────────────────────────────────┤
│  DATABASE  (src/database.py)                         │
│  Maneja la conexión con el archivo repuestos.db      │
│  • engine     → la "conexión" a SQLite               │
│  • get_session → genera una sesión por cada pedido   │
│  • create_tables → crea las tablas al iniciar        │
└──────────────────────────────────────────────────────┘
```

---

## Los 5 endpoints de cada recurso

Cada uno de los 3 modelos (Categoria, Proveedor, Producto) tiene exactamente estos endpoints:

| Método HTTP | Ruta           | ¿Qué hace?                          | Código de éxito |
|-------------|----------------|-------------------------------------|-----------------|
| `POST`      | `/productos/`  | Crea un nuevo registro en la DB     | `201 Created`   |
| `GET`       | `/productos/`  | Devuelve todos (paginado)           | `200 OK`        |
| `GET`       | `/productos/1` | Devuelve uno por ID                 | `200 OK`        |
| `PUT`       | `/productos/1` | Reemplaza todos los campos de uno   | `200 OK`        |
| `DELETE`    | `/productos/1` | Elimina uno de la DB                | `200 OK`        |

> Si el ID no existe en GET, PUT o DELETE → devuelve `404 Not Found` con un mensaje de error.

---

## Las migraciones (Alembic)

Las migraciones son el **historial de cambios** de la base de datos.

```bash
alembic upgrade head     ← aplica todos los cambios pendientes
alembic downgrade -1     ← deshace el último cambio
```

Cada archivo en `alembic/versions/` describe qué tablas crear o modificar.
El archivo `0001_initial.py` fue el primero: creó las tablas `categoria`, `proveedor` y `producto`.

---

## Dónde ver todo funcionando

Una vez que levantás el servidor con `fastapi dev src/main.py`, podés ir a:

- **`http://127.0.0.1:8000/docs`** → Swagger UI: probás cada endpoint visualmente
- **`http://127.0.0.1:8000/redoc`** → documentación alternativa más detallada

---

## Resumen visual del flujo completo

```
fastapi dev src/main.py
        │
        ▼
    main.py
    ├── Crea tablas (SQLite)
    ├── Configura CORS
    └── Registra routers
              │
              ▼
    Llega un pedido HTTP
              │
        ┌─────┴──────┐
        │            │
    Router         Router
    valida         busca en
    entrada        la DB
        │            │
        └─────┬──────┘
              │
         Model/Schema
         serializa la
         respuesta
              │
              ▼
         JSON → al cliente
```
