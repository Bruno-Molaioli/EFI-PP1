import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import ProductoDetalleDesc from './components/ProductoDetalleDesc'
import ProductoDetalleCompatibilidad from './components/ProductoDetalleCompatibilidad'
import AgregarProducto from './pages/AgregarProducto'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100">
          <Navbar />

          <Routes>
            {/* R1: Rutas Base */}
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/crear" element={<AgregarProducto />} />

            {/* R1: Ruta Dinámica y Rutas Anidadas */}
            <Route path="/productos/:id" element={<ProductDetail />}>
              <Route index element={<ProductoDetalleDesc />} />
              <Route path="compatibilidad" element={<ProductoDetalleCompatibilidad />} />
            </Route>

            {/* Ruta no encontrada */}
            <Route
              path="*"
              element={
                <div className="flex-1 flex flex-col justify-center items-center py-20">
                  <h1 className="text-6xl font-black text-amber-500">404</h1>
                  <p className="text-zinc-400 mt-2">Página no encontrada</p>
                </div>
              }
            />
          </Routes>

          <Footer />
        </div>
      </UserProvider>
    </CartProvider>
  )
}

export default App
