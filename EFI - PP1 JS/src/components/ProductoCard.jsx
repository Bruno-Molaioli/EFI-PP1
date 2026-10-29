import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function ProductoCard({ producto, onDelete }) {
  const { addToCart } = useContext(CartContext)

  const compatibilidadBadge = {
    Autos: 'bg-blue-900/60 text-blue-300 border-blue-700',
    Motos: 'bg-amber-900/60 text-amber-300 border-amber-700',
    Ambos: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  }

  return (
    <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-lg">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
              compatibilidadBadge[producto.compatibilidad] ||
              'bg-zinc-700 text-zinc-300 border-zinc-600'
            }`}
          >
            {producto.compatibilidad}
          </span>
          {producto.categoria && (
            <span className="text-xs text-zinc-400 font-medium">
              {producto.categoria.nombre}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-zinc-100 mt-2 line-clamp-1">
          {producto.nombre}
        </h3>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-2xl font-black text-amber-400">
            ${Number(producto.precio).toLocaleString('es-AR')}
          </p>
          <span className="text-xs text-zinc-400">
            Stock: <strong className={producto.stock > 0 ? 'text-zinc-200' : 'text-red-400'}>{producto.stock}</strong>
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={() => addToCart(producto)}
          disabled={producto.stock <= 0}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-bold py-2 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {producto.stock > 0 ? '🛒 Agregar al carrito' : 'Sin stock'}
        </button>

        <div className="flex gap-2">
          <Link
            to={`/productos/${producto.id}`}
            className="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs py-2 rounded-lg font-medium transition-colors"
          >
            Ver detalle
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(producto.id)}
              title="Eliminar repuesto"
              className="px-3 bg-red-950/60 hover:bg-red-800 text-red-300 border border-red-800/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
