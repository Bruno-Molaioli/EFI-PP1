# 🔧 Repuestos para Autos y Motos — EFI JS 2026

Aplicación web desarrollada en **React + Vite + Tailwind CSS** que consume la API REST del proyecto EFI de Python (FastAPI), permitiendo gestionar un catálogo integral de repuestos de vehículos automotores.

---

## 👥 Integrantes

- Bruno Molaioli
- Mateo Magallanes
- Danilo Posseto

---

## 🚀 Tech Stack

| Herramienta | Rol |
|-------------|-----|
| **React 19** | Biblioteca de interfaz de usuario |
| **Vite** | Bundler y servidor de desarrollo ultrarrápido |
| **React Router DOM v7** | Enrutamiento SPA, rutas dinámicas y anidadas |
| **Tailwind CSS v4** | Estilos utilitarios y diseño responsivo |
| **Context API** | Gestión de estado global (Carrito + Rol de Usuario) |
| **Fetch API nativo** | Consumo asíncrono de la API REST |

---

## 📋 Requisitos y funcionalidades implementadas

### 1. Enrutamiento (`react-router-dom`)
- `/` — Página de bienvenida con categorías destacadas y llamada a la acción.
- `/productos` — Catálogo con filtrado por compatibilidad (Autos, Motos, Ambos), eliminación y edición modal para administradores.
- `/productos/:id` — Vista detallada de un repuesto con subrutas anidadas:
  - `/productos/:id/descripcion` — Especificaciones completas del repuesto.
  - `/productos/:id/compatibilidad` — Detalles de compatibilidad vehicular y proveedor.
- `/nuevo-producto` — Formulario con validación para crear nuevos repuestos (exclusivo Admin).
- `/categorias` — Listado y creación de categorías (creación exclusiva Admin).
- `/proveedores` — Listado y alta de proveedores (creación exclusiva Admin).
- `/carrito` — Carrito de compras con cálculo de subtotales, control de cantidades y vaciado.

### 2. Estado Global (Context API)
- **`CartContext`**: Manejo de productos añadidos al carrito, incremento/decremento de unidades, cálculo de total y persistencia en `localStorage`.
- **`UserContext`**: Manejo de sesión y roles (`Admin` / `Usuario`). Incluye botón de alternancia directa en el `Navbar` para pruebas de permisos en tiempo real.

### 3. Roles y Seguridad en UI
- Los usuarios con rol estándar pueden explorar el catálogo, ver detalles, filtrar y comprar repuestos en el carrito.
- Solo los usuarios con rol **Admin** pueden:
  - Ver botones de eliminación (`🗑️`) con actualización optimista.
  - Abrir el modal de edición (`✏️`) para actualizar repuestos mediante método `PUT`.
  - Acceder al formulario de creación de nuevos productos.
  - Registrar nuevas categorías y proveedores.

### 4. Consumo de API y 4 Estados UI
- Peticiones HTTP a todos los endpoints CRUD (`GET`, `POST`, `PUT`, `DELETE`).
- Manejo explícito de los 4 estados:
  - **Loading**: Spinners de carga visuales.
  - **Empty**: Mensajes claros cuando no hay datos o filtros coincidentes.
  - **Error**: Alertas visuales con instrucciones para levantar el backend y botón de reintento.
  - **Success**: Renderizado fluido y actualizado reactivamente sin recargar la página.

---

## ⚙️ Ejecución local

> **Requisito previo**: tener corriendo la API de Python en `http://127.0.0.1:8000`

```bash
# 1. Instalar dependencias
npm install

# 2. Variable de entorno (opcional si corre en el puerto por defecto)
# Crea un archivo .env si necesitas cambiar la URL:
# VITE_API_URL=http://127.0.0.1:8000

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## 🗂️ Estructura del proyecto

```
src/
├── components/
│   ├── EditarProductoModal.jsx          # Modal con formulario pre-rellenado (PUT)
│   ├── Footer.jsx                       # Pie de página institucional
│   ├── Navbar.jsx                       # Barra de navegación + toggle de rol Admin + badge de carrito
│   ├── ProductoCard.jsx                 # Tarjeta de producto con acciones condicionales
│   ├── ProductoDetalleCompatibilidad.jsx# Componente de ruta anidada
│   └── ProductoDetalleDesc.jsx          # Componente de ruta anidada
├── context/
│   ├── CartContext.jsx                  # Estado global del carrito (con localStorage)
│   └── UserContext.jsx                  # Estado global del rol de usuario (Admin / Usuario)
├── pages/
│   ├── AgregarProducto.jsx              # Formulario de alta de productos
│   ├── Cart.jsx                         # Vista del carrito de compras
│   ├── Categorias.jsx                   # Listado y alta de categorías
│   ├── Home.jsx                         # Portada / Hero
│   ├── ProductDetail.jsx                # Detalle con navegación anidada
│   ├── Products.jsx                     # Catálogo general con filtros
│   └── Proveedores.jsx                  # Listado y alta de proveedores
├── App.jsx                              # Definición de rutas y wrappers de contexto
├── index.css                            # Configuración de estilos Tailwind CSS
└── main.jsx                             # Montaje principal de la aplicación React
```
