# 🔧 Repuestos para Autos y Motos — EFI JS 2026

Aplicación web desarrollada en **React + Vite** que consume la API REST del proyecto EFI de Python (FastAPI), permitiendo gestionar un sistema de repuestos de vehículos automotores.

---

## 👥 Integrantes

- Bruno Molaioli
- Mateo Magallanes
- Danilo Posseto

---

## 🚀 Tech Stack

| Herramienta | Rol |
|-------------|-----|
| **React 19** | Framework UI |
| **Vite** | Bundler / Dev Server |
| **React Router DOM** | Enrutamiento SPA |
| **Axios** | Cliente HTTP |
| **Context API** | Estado global (Favoritos + Tema) |
| **Tailwind CSS v4** | Estilos utilitarios |

---

## 📋 Requisitos cubiertos

### R1 — Enrutamiento (`react-router-dom`)
| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Base | Inicio / Hero |
| `/productos` | Base | Catálogo con paginación |
| `/categorias` | Base | ABM de categorías |
| `/proveedores` | Base | ABM de proveedores |
| `/favoritos` | Base | Lista de favoritos (Context) |
| `/productos/:id` | **Dinámica** | Detalle de un repuesto |
| `/categorias/:id/productos` | **Anidada** | Productos de una categoría |

### R2 — Consumo de API y Estado
- Peticiones asíncronas con **Axios** (`fetch`/`axios`)
- `useState` para datos, loading y errores
- `useEffect` para disparar requests al montar/cambiar
- Validación de formularios (campos obligatorios, longitud, formato)
- Operaciones: **GET, POST, PUT, DELETE**

### R3 — Context API
- `FavoritosContext` con `createContext` + `useContext`
- Guardar/eliminar productos en favoritos
- Selector de tema (Claro / Oscuro) con `toggleTema`

### R4 — Hosting en Vercel
- Variables de entorno vía `.env` (`VITE_API_URL`)
- Configurar `VITE_API_URL` en el panel de Vercel apuntando a la API desplegada

---

## ⚙️ Ejecución local

> **Requisito previo**: tener corriendo la API de Python en `http://127.0.0.1:8000`

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variable de entorno
cp .env.example .env
# Editar .env si la API corre en otro puerto

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🗂️ Estructura del proyecto

```
src/
├── api/
│   ├── axiosClient.js       # Instancia base de Axios con VITE_API_URL
│   └── repuestos.js         # Todas las llamadas a la API (CRUD)
├── components/
│   ├── Navbar.jsx           # Navegación principal
│   ├── ProductoCard.jsx     # Card reutilizable de producto
│   ├── ProductoForm.jsx     # Formulario con validación
│   ├── LoadingSpinner.jsx   # Indicador de carga
│   ├── ErrorMessage.jsx     # Mensaje de error
│   └── Paginacion.jsx       # Controles de paginación
├── context/
│   └── FavoritosContext.jsx # Context API: favoritos + tema
└── pages/
    ├── Inicio.jsx
    ├── Productos.jsx
    ├── ProductoDetalle.jsx  # Ruta dinámica /:id
    ├── Categorias.jsx
    ├── CategoriaProductos.jsx  # Ruta anidada /categorias/:id/productos
    ├── Proveedores.jsx
    ├── Favoritos.jsx
    └── NotFound.jsx
```

---

## 🔗 API Backend (Python / FastAPI)

| Recurso | Endpoints |
|---------|-----------|
| `/productos` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |
| `/categorias` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |
| `/proveedores` | POST · GET · GET `/{id}` · PUT `/{id}` · DELETE `/{id}` |

Docs interactivos disponibles en `http://127.0.0.1:8000/docs`
