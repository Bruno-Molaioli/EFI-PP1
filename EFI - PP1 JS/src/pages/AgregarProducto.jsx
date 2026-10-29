import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

export default function AgregarProducto() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    compatibilidad: 'Autos',
    categoria_id: '',
    proveedor_id: '',
  })

  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [mensajeOk, setMensajeOk] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    // Cargar categorías y proveedores existentes para el selector
    fetch(`${API_URL}/categorias/?size=50`)
      .then((res) => res.json())
      .then((data) => setCategorias(data.items || data))
      .catch(() => {})

    fetch(`${API_URL}/proveedores/?size=50`)
      .then((res) => res.json())
      .then((data) => setProveedores(data.items || data))
      .catch(() => {})
  }, [])

  if (!user.admin) {
    return (
      <section className="flex-1 flex justify-center items-center p-8 text-center">
        <div className="bg-red-950/40 border border-red-800 p-8 rounded-xl max-w-md">
          <p className="text-3xl mb-2">🚫</p>
          <p className="text-red-400 text-xl font-bold">Acceso restringido</p>
          <p className="text-zinc-400 text-sm mt-1">
            Solo los administradores pueden registrar nuevos repuestos. Activá el rol admin desde el botón de la barra de navegación.
          </p>
        </div>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const err = {}
    if (!form.nombre.trim() || form.nombre.length < 2) {
      err.nombre = 'El nombre debe tener al menos 2 caracteres'
    }
    if (!form.descripcion.trim() || form.descripcion.length < 5) {
      err.descripcion = 'La descripción debe tener al menos 5 caracteres'
    }
    if (!form.precio || Number(form.precio) <= 0) {
      err.precio = 'El precio debe ser un número mayor a 0'
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      err.stock = 'El stock debe ser 0 o superior'
    }
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10),
        compatibilidad: form.compatibilidad,
        categoria_id: form.categoria_id ? parseInt(form.categoria_id, 10) : null,
        proveedor_id: form.proveedor_id ? parseInt(form.proveedor_id, 10) : null,
      }

      const res = await fetch(`${API_URL}/productos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Error al guardar')
      }

      setMensajeOk(true)
      setErrors({})
      setTimeout(() => {
        navigate('/productos')
      }, 1200)
    } catch (err) {
      alert('Error al registrar repuesto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex-1 flex flex-col items-center py-10 px-4 max-w-xl mx-auto w-full">
      <h1 className="text-3xl font-black text-zinc-100 mb-2">Agregar nuevo repuesto</h1>
      <p className="text-sm text-zinc-400 mb-6 text-center">
        Completá los datos técnicos para dar de alta el repuesto en el inventario.
      </p>

      {mensajeOk && (
        <div className="w-full bg-emerald-950/60 border border-emerald-700 text-emerald-300 p-4 rounded-xl text-center mb-6 font-semibold animate-pulse">
          ✓ Repuesto guardado exitosamente. Redirigiendo al catálogo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full bg-zinc-800/90 border border-zinc-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Nombre del repuesto *
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Pastillas de freno delanteras"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none"
          />
          {errors.nombre && <p className="text-xs text-red-400 mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Detalle técnico, material, ubicación o modelo..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none"
          />
          {errors.descripcion && <p className="text-xs text-red-400 mt-1">{errors.descripcion}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Precio ($) *
            </label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
            {errors.precio && <p className="text-xs text-red-400 mt-1">{errors.precio}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Stock inicial *
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
            {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Compatibilidad
          </label>
          <select
            name="compatibilidad"
            value={form.compatibilidad}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="Autos">Autos</option>
            <option value="Motos">Motos</option>
            <option value="Ambos">Ambos</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Categoría
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer text-sm"
            >
              <option value="">-- Sin categoría --</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Proveedor
            </label>
            <select
              name="proveedor_id"
              value={form.proveedor_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer text-sm"
            >
              <option value="">-- Sin proveedor --</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
        >
          {loading ? 'Guardando en la API...' : '✓ Guardar Repuesto'}
        </button>
      </form>
    </section>
  )
}
