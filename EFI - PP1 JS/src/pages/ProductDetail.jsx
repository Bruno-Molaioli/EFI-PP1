import { useState, useEffect, useContext } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useContext(CartContext)

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Repuesto no encontrado')
        return res.json()
      })
      .then((data) => {
        setProducto(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
        <span className="ml-3 text-zinc-400">Cargando detalle...</span>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-zinc-800 rounded-xl text-center border border-zinc-700">
        <p className="text-4xl">❌</p>
        <h2 className="text-xl font-bold text-zinc-200 mt-2">Repuesto no encontrado</h2>
        <p className="text-zinc-400 text-sm mt-1">El repuesto solicitado no existe o fue eliminado.</p>
        <Link to="/productos" className="mt-4 inline-block text-amber-400 hover:underline text-sm font-semibold">
          ← Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 w-full flex-1">
      <Link to="/productos" className="text-sm text-amber-400 hover:underline inline-flex items-center gap-1 mb-4">
        ← Volver al catálogo
      </Link>

      <div className="bg-zinc-800/80 border border-zinc-700/60 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {producto.compatibilidad}
              </span>
              {producto.categoria && (
                <span className="text-zinc-400 text-xs bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                  {producto.categoria.nombre}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-zinc-100">{producto.nombre}</h1>
            <p className="text-zinc-400 text-sm mt-2">{producto.descripcion}</p>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-3xl font-black text-amber-400">
                ${Number(producto.precio).toLocaleString('es-AR')}
              </span>
              <span className="text-sm text-zinc-400">
                Stock actual: <strong className={producto.stock > 0 ? 'text-zinc-200' : 'text-red-400'}>{producto.stock}</strong> unidades
              </span>
            </div>
          </div>

          <button
            onClick={() => addToCart(producto)}
            disabled={producto.stock <= 0}
            className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer shrink-0 shadow-lg shadow-amber-500/20"
          >
            {producto.stock > 0 ? '🛒 Agregar al carrito' : 'Sin stock'}
          </button>
        </div>

        {/* Subrutas anidadas - pestañas */}
        <div className="flex gap-4 border-b border-zinc-700 mt-10 mb-6">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `pb-3 font-semibold text-sm border-b-2 transition-colors ${
                isActive
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`
            }
          >
            Descripción técnica
          </NavLink>

          <NavLink
            to="compatibilidad"
            className={({ isActive }) =>
              `pb-3 font-semibold text-sm border-b-2 transition-colors ${
                isActive
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`
            }
          >
            Compatibilidad & Proveedor
          </NavLink>
        </div>

        {/* Renderiza el subcomponente anidado pasándole el producto */}
        <Outlet context={producto} />
      </div>
    </div>
  )
}
