# ⚛️ ¿Cómo funciona la app visual? — EFI PP1 JavaScript

## El punto de entrada: `src/main.jsx`

Todo arranca acá. Es el **primer archivo que ejecuta el navegador** cuando abrís `http://localhost:5173`.

Lo que hace ese archivo, en orden:

```
1. Importa React y ReactDOM
2. Envuelve toda la app en <BrowserRouter> → activa el sistema de rutas
3. Renderiza <App /> dentro del <div id="root"> del index.html
```

Desde ese momento, React toma el control total de la pantalla.

---

## El viaje completo cuando abrís una página

Tomemos como ejemplo: **el usuario entra a `/productos`**.

```
NAVEGADOR
  └── Escribe localhost:5173/productos
        │
        ▼
src/main.jsx
  └── <BrowserRouter> detecta la URL "/productos"
        │
        ▼
src/App.jsx
  └── <Routes> busca qué componente corresponde a esa ruta
  └── Encuentra: <Route path="/productos" element={<Products />} />
        │
        ▼
src/pages/Products.jsx  ← se renderiza en pantalla
  └── useState([])  → crea una lista vacía de productos
  └── useEffect()   → al montar el componente, llama a la API:
                       fetch("http://127.0.0.1:8000/productos/?size=50")
        │
        ▼  (respuesta de la API)
  └── setProductos(data.items) → guarda la lista en el estado
  └── React re-renderiza la pantalla con las tarjetas de productos
        │
        ▼
src/components/ProductoCard.jsx  ← una card por cada producto
  └── Muestra: nombre, precio, stock, badge de compatibilidad
  └── Botón "Agregar al carrito" → llama a addToCart() del CartContext
```

---

## La estructura del proyecto

```
src/
│
├── main.jsx          ← PUNTO DE ENTRADA. Monta React en el HTML.
│
├── App.jsx           ← ENRUTADOR. Define qué página se muestra
│                        según la URL. Envuelve todo en los Providers.
│
├── pages/            ← PÁGINAS COMPLETAS (una por ruta)
│   ├── Home.jsx              /
│   ├── Products.jsx          /productos
│   ├── ProductDetail.jsx     /productos/:id
│   ├── Categorias.jsx        /categorias
│   ├── Proveedores.jsx       /proveedores
│   ├── AgregarProducto.jsx   /crear
│   └── Cart.jsx              /cart
│
├── components/       ← PIEZAS REUTILIZABLES (partes de UI)
│   ├── Navbar.jsx             barra de navegación superior
│   ├── Footer.jsx             pie de página
│   ├── ProductoCard.jsx       tarjeta de un repuesto
│   ├── ProductoDetalleDesc.jsx        subruta de detalle
│   └── ProductoDetalleCompatibilidad.jsx  subruta de detalle
│
└── context/          ← ESTADO GLOBAL (datos compartidos entre páginas)
    ├── CartContext.jsx        el carrito de compras
    └── UserContext.jsx        el rol del usuario (Admin / Usuario)
```

---

## Los 3 conceptos clave de React usados en el proyecto

### 1. `useState` → guardar datos que cambian

```jsx
const [productos, setProductos] = useState([])
//     ↑ valor actual   ↑ función para cambiarlo   ↑ valor inicial
```
Cada vez que llamás a `setProductos(...)`, React vuelve a dibujar la pantalla automáticamente.

---

### 2. `useEffect` → ejecutar algo cuando el componente aparece

```jsx
useEffect(() => {
    fetch(`${API_URL}/productos/`)
        .then(res => res.json())
        .then(data => setProductos(data.items))
}, [])   // ← el [] significa "solo al montar, una sola vez"
```
Esto es lo que hace que los datos se carguen desde la API cuando entrás a una página.

---

### 3. Context API → compartir datos entre páginas sin pasarlos de componente en componente

```
CartContext
    └── Guarda: lista de productos en el carrito
    └── Funciones: addToCart, removeFromCart, updateQuantity
    └── Todos los componentes pueden usarlo con: useContext(CartContext)

UserContext
    └── Guarda: si el usuario es Admin o no
    └── Función: toggleAdmin (para simular el cambio de rol)
    └── Controla: qué botones/formularios se muestran
```

---

## Las rutas del proyecto

| URL | Tipo | Componente |
|-----|------|------------|
| `/` | Base | `Home.jsx` |
| `/productos` | Base | `Products.jsx` |
| `/productos/:id` | **Dinámica** | `ProductDetail.jsx` |
| `/productos/:id` (pestaña Descripción) | **Anidada** | `ProductoDetalleDesc.jsx` |
| `/productos/:id/compatibilidad` | **Anidada** | `ProductoDetalleCompatibilidad.jsx` |
| `/categorias` | Base | `Categorias.jsx` |
| `/proveedores` | Base | `Proveedores.jsx` |
| `/crear` | Base | `AgregarProducto.jsx` |
| `/cart` | Base | `Cart.jsx` |

> Las rutas **dinámicas** usan `useParams()` para leer el `:id` de la URL.
> Las rutas **anidadas** usan `<Outlet />` para mostrar subcomponentes dentro de la misma página.

---

## ¿Cómo se comunica con la API de Python?

La URL de la API está en el archivo `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Y en cualquier componente se lee así:

```jsx
const API_URL = import.meta.env.VITE_API_URL
```

Luego se usa con `fetch`:

```jsx
// Leer datos (GET)
fetch(`${API_URL}/productos/`)

// Crear datos (POST)
fetch(`${API_URL}/productos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: '...', precio: 100 })
})

// Eliminar datos (DELETE)
fetch(`${API_URL}/productos/1`, { method: 'DELETE' })
```

---

## Los 4 estados que maneja cada página

Cada página que consulta la API maneja estos 4 estados visuales:

| Estado | ¿Cuándo aparece? | ¿Qué ve el usuario? |
|--------|-----------------|---------------------|
| **Loading** | Mientras espera la respuesta de la API | Spinner girando |
| **Error** | Si la API no responde o hay fallo de red | Mensaje de error rojo + botón "Reintentar" |
| **Empty** | Si la API responde pero no hay datos | Mensaje "No hay repuestos registrados" |
| **Success** | Cuando los datos llegan correctamente | Las tarjetas / lista de productos |

---

## Resumen visual del flujo completo

```
index.html  (el HTML vacío con <div id="root">)
    │
    ▼
src/main.jsx  (monta React dentro del div)
    │
    ▼
src/App.jsx  (decide qué página mostrar según la URL)
    │
    ├──/productos ──▶ Products.jsx
    │                    │
    │                    ├── useEffect → fetch API → useState
    │                    └── renderiza → ProductoCard × N
    │
    ├──/productos/3 ──▶ ProductDetail.jsx
    │                    │
    │                    ├── useParams → id = 3
    │                    ├── fetch API /productos/3
    │                    └── <Outlet /> → muestra subruta activa
    │
    └──/crear ──▶ AgregarProducto.jsx
                    │
                    ├── verifica user.admin (UserContext)
                    ├── formulario controlado con useState
                    └── onSubmit → fetch POST /productos/
```
