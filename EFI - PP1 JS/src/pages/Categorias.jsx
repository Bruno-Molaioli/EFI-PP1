import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function Categorias() {
  const { user } = useContext(UserContext)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevaDesc, setNuevaDesc] = useState('')
  const [enviando, setEnviando] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const cargarCategorias = () => {
    setLoading(true)
    fetch(`${API_URL}/categorias/?size=50`)
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data.items || data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user.admin) {
      alert('Solo los administradores pueden crear categorías')
      return
    }

    if (!nuevoNombre.trim() || !nuevaDesc.trim()) {
      alert('Completá nombre y descripción')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch(`${API_URL}/categorias/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoNombre.trim(),
          descripcion: nuevaDesc.trim(),
        }),
      })
      if (!res.ok) throw new Error('Error al crear categoría')
      setNuevoNombre('')
      setNuevaDesc('')
      cargarCategorias()
    } catch (err) {
      alert(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const handleDelete = async (id) => {
    if (!user.admin) return
    if (!window.confirm('¿Seguro que deseás eliminar esta categoría?')) return

    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar')
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
      <h1 className="text-3xl font-black text-zinc-100 mb-2">Categorías de Repuestos</h1>
      <p className="text-sm text-zinc-400 mb-8">
        Clasificación de piezas y componentes para autos y motos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Panel lateral: Formulario solo para ADMIN */}
        <div className="h-fit">
          {user.admin ? (
            <div className="bg-zinc-800/80 border border-zinc-700/60 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-amber-400 mb-4">+ Nueva Categoría</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej: Transmisión"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Descripción</label>
                  <textarea
                    value={nuevaDesc}
                    onChange={(e) => setNuevaDesc(e.target.value)}
                    placeholder="Breve detalle..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {enviando ? 'Guardando...' : 'Crear categoría'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-800/40 border border-zinc-800 p-6 rounded-2xl text-center">
              <span className="text-2xl">🔒</span>
              <p className="font-bold text-zinc-300 text-sm mt-2">Modo lectura</p>
              <p className="text-xs text-zinc-500 mt-1">
                Solo los administradores pueden dar de alta o eliminar categorías.
              </p>
            </div>
          )}
        </div>

        {/* Listado de categorías */}
        <div className="md:col-span-2 space-y-3">
          {loading ? (
            <p className="text-zinc-400">Cargando categorías...</p>
          ) : categorias.length === 0 ? (
            <p className="text-zinc-500">No hay categorías registradas aún.</p>
          ) : (
            categorias.map((cat) => (
              <div
                key={cat.id}
                className="bg-zinc-800/60 border border-zinc-700/60 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-zinc-100">{cat.nombre}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{cat.descripcion}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded">
                    ID #{cat.id}
                  </span>
                  {user.admin && (
                    <button
                      onClick={() => handleDelete(cat.id)}
                      title="Eliminar categoría"
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 border border-red-900 cursor-pointer"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
