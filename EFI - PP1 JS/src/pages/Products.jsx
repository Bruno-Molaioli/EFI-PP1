import { useState, useEffect, useContext } from 'react'
import ProductoCard from '../components/ProductoCard'
import { UserContext } from '../context/UserContext'

export default function Products() {
  const { user } = useContext(UserContext)
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('Todos')

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const cargarProductos = () => {
    setLoading(true)
    setError(null)
    fetch(`${API_URL}/productos/?size=50`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la API')
        return res.json()
      })
      .then((data) => {
        // Soporta respuesta paginada { items: [...] } o array directo
        const items = data.items || data
        setProductos(items)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('No se pudo conectar con el servidor de la API en ' + API_URL)
        setLoading(false)
      })
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleDelete = async (id) => {
    if (!user.admin) {
      alert('Solo los administradores pueden eliminar repuestos')
      return
    }

    if (!window.confirm('¿Seguro que querés eliminar este repuesto?')) return

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar')
      
      // Aseguramos conversión a Number para que desaparezca al instante del estado
      setProductos((prev) => prev.filter((p) => Number(p.id) !== Number(id)))
    } catch (err) {
      alert('Error al eliminar el repuesto: ' + err.message)
    }
  }

  const productosFiltrados = productos.filter((p) => {
    if (filtro === 'Todos') return true
    return p.compatibilidad === filtro
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-100">Catálogo de Repuestos</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Mostrando {productosFiltrados.length} productos disponibles
          </p>
        </div>

        {/* Filtro por compatibilidad */}
        <div className="flex gap-2">
          {['Todos', 'Autos', 'Motos', 'Ambos'].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filtro === opcion
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700'
              }`}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <span className="ml-4 text-zinc-400 font-medium">Cargando repuestos...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-800 text-red-300 p-6 rounded-xl text-center">
          <p className="font-bold text-lg">⚠️ Error al cargar productos</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs text-red-400 mt-3">
            Asegurate de que el backend de Python esté ejecutándose con: <code className="bg-red-900/60 px-2 py-0.5 rounded font-mono">fastapi dev src/main.py</code>
          </p>
          <button
            onClick={cargarProductos}
            className="mt-4 bg-red-800 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-bold"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && productosFiltrados.length === 0 && (
        <div className="text-center py-20 bg-zinc-800/30 rounded-xl border border-zinc-800">
          <p className="text-4xl">📦</p>
          <p className="text-zinc-400 font-medium mt-2">No hay repuestos registrados con este filtro.</p>
        </div>
      )}

      {!loading && !error && productosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((prod) => (
            <ProductoCard
              key={prod.id}
              producto={prod}
              onDelete={user.admin ? handleDelete : null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
