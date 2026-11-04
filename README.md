# 🔧 EFI — Programación Profesional 1 (2026)

**Evaluación Final Integradora — Sistema de Gestión y Catálogo de Repuestos para Autos y Motos**

Este repositorio contiene tanto el **Backend** (API REST en Python) como el **Frontend** (SPA en React + JavaScript), integrados y comunicados de forma desacoplada.

---

## 👥 Integrantes

- **Bruno Molaioli**
- **Mateo Magallanes**
- **Danilo Posseto**

---

## 📁 Estructura del Repositorio

El proyecto está organizado en dos módulos independientes:

```
EFI-PP1/
├── EFI - PP1 Python/    # Backend: API REST (FastAPI + SQLModel + Alembic + SQLite)
│   ├── src/             # Routers, Models y Conexión a Base de Datos
│   ├── alembic/         # Control de migraciones de base de datos
│   ├── requirements.txt # Dependencias de Python
│   ├── COMO_FUNCIONA.md # Guía pedagógica del flujo interno de la API
│   └── README.md        # Documentación específica del backend
│
└── EFI - PP1 JS/        # Frontend: Interfaz web (React 19 + Vite + Tailwind CSS)
    ├── src/             # Páginas, Componentes y Context API
    ├── package.json     # Dependencias de JavaScript
    ├── COMO_FUNCIONA.md # Guía pedagógica del funcionamiento del frontend
    └── README.md        # Documentación específica del frontend
```

---

## 🚀 Puesta en marcha rápida (Guía paso a paso)

Para ejecutar el sistema completo, se requieren dos terminales abiertas:

### 1️⃣ Paso 1: Iniciar el Backend (Python / FastAPI)

Abrir una terminal en la carpeta `EFI - PP1 Python`:

```bash
cd "EFI - PP1 Python"

# 1. Crear y activar entorno virtual (opcional pero recomendado)
python -m venv venv
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
# source venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Aplicar migraciones iniciales de base de datos
alembic upgrade head

# 4. Iniciar el servidor
fastapi dev src/main.py
```

> 🌐 **Backend activo en:** `http://127.0.0.1:8000`  
> 📖 **Documentación interactiva Swagger / OpenAPI:** `http://127.0.0.1:8000/docs`

---

### 2️⃣ Paso 2: Iniciar el Frontend (React / Vite)

Abrir una segunda terminal en la carpeta `EFI - PP1 JS`:

```bash
cd "EFI - PP1 JS"

# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

> 💻 **Frontend activo en:** `http://localhost:5173`

---

## 🛠️ Tecnologías y Arquitectura

| Módulo | Tecnologías principales | Responsabilidad |
|---|---|---|
| **Backend** | Python 3.12+, FastAPI, SQLModel, Alembic, SQLite, Pydantic | Persistencia de datos, validación de schemas, CORS, paginación y endpoints CRUD para Productos, Categorías y Proveedores. |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM v7, Context API | Interfaz interactiva SPA, catálogo con filtros, carrito de compras con persistencia local, modal de edición con PUT, y control de roles (Admin / Usuario). |

---

## 📚 Documentación adicional

Dentro de cada carpeta se incluye un archivo `COMO_FUNCIONA.md` con explicaciones detalladas y esquemas de flujo:
- [`EFI - PP1 Python/COMO_FUNCIONA.md`](EFI%20-%20PP1%20Python/COMO_FUNCIONA.md) — Explicación paso a paso de routers, dependencias y ciclo de vida de peticiones HTTP en FastAPI.
- [`EFI - PP1 JS/COMO_FUNCIONA.md`](EFI%20-%20PP1%20JS/COMO_FUNCIONA.md) — Explicación de montaje en React, enrutamiento, contextos globales y llamadas asíncronas con optimismo visual.
