import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function Proveedores() {
  const { user } = useContext(UserContext)
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
  })
  const [enviando, setEnviando] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const cargarProveedores = () => {
    setLoading(true)
    fetch(`${API_URL}/proveedores/?size=50`)
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data.items || data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    cargarProveedores()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user.admin) {
      alert('Solo los administradores pueden registrar proveedores')
      return
    }

    if (!form.nombre.trim() || !form.telefono.trim() || !form.email.trim()) {
      alert('Completá todos los campos del proveedor')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch(`${API_URL}/proveedores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al registrar proveedor')
      setForm({ nombre: '', telefono: '', email: '' })
      cargarProveedores()
    } catch (err) {
      alert(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const handleDelete = async (id) => {
    if (!user.admin) return
    if (!window.confirm('¿Seguro que deseás eliminar este proveedor?')) return

    try {
      const res = await fetch(`${API_URL}/proveedores/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar')
      setProveedores((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
      <h1 className="text-3xl font-black text-zinc-100 mb-2">Proveedores & Marcas</h1>
      <p className="text-sm text-zinc-400 mb-8">
        Empresas y distribuidores oficiales de repuestos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario solo para ADMIN */}
        <div className="h-fit">
          {user.admin ? (
            <div className="bg-zinc-800/80 border border-zinc-700/60 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-amber-400 mb-4">+ Nuevo Proveedor</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Nombre / Empresa *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Brembo Frenos"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 3514445566"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Email de contacto *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ventas@brembo.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {enviando ? 'Guardando...' : 'Registrar proveedor'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-800/40 border border-zinc-800 p-6 rounded-2xl text-center">
              <span className="text-2xl">🔒</span>
              <p className="font-bold text-zinc-300 text-sm mt-2">Modo lectura</p>
              <p className="text-xs text-zinc-500 mt-1">
                Solo los administradores pueden dar de alta o eliminar proveedores.
              </p>
            </div>
          )}
        </div>

        {/* Listado */}
        <div className="md:col-span-2 space-y-3">
          {loading ? (
            <p className="text-zinc-400">Cargando proveedores...</p>
          ) : proveedores.length === 0 ? (
            <p className="text-zinc-500">No hay proveedores registrados aún.</p>
          ) : (
            proveedores.map((prov) => (
              <div
                key={prov.id}
                className="bg-zinc-800/60 border border-zinc-700/60 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-zinc-100">{prov.nombre}</h3>
                  <div className="text-xs text-zinc-400 mt-1 space-x-3">
                    <span>📞 {prov.telefono}</span>
                    <span>✉️ {prov.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded">
                    ID #{prov.id}
                  </span>
                  {user.admin && (
                    <button
                      onClick={() => handleDelete(prov.id)}
                      title="Eliminar proveedor"
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
