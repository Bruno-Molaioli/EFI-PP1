import { useState, useEffect } from 'react'

export default function EditarProductoModal({ producto, onClose, onGuardado }) {
  const [form, setForm] = useState({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    compatibilidad: producto.compatibilidad,
    categoria_id: producto.categoria_id ?? '',
    proveedor_id: producto.proveedor_id ?? '',
  })

  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [errors, setErrors] = useState({})

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  // Cargar selects
  useEffect(() => {
    fetch(`${API_URL}/categorias/?size=50`)
      .then((r) => r.json())
      .then((d) => setCategorias(d.items || d))
      .catch(() => {})

    fetch(`${API_URL}/proveedores/?size=50`)
      .then((r) => r.json())
      .then((d) => setProveedores(d.items || d))
      .catch(() => {})
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const err = {}
    if (!form.nombre.trim() || form.nombre.length < 2)
      err.nombre = 'Mínimo 2 caracteres'
    if (!form.descripcion.trim() || form.descripcion.length < 5)
      err.descripcion = 'Mínimo 5 caracteres'
    if (!form.precio || Number(form.precio) <= 0)
      err.precio = 'Debe ser mayor a 0'
    if (form.stock === '' || Number(form.stock) < 0)
      err.stock = 'Debe ser 0 o más'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setEnviando(true)
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

      const res = await fetch(`${API_URL}/productos/${producto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Error al guardar')
      }

      const productoActualizado = await res.json()
      onGuardado(productoActualizado)
      onClose()
    } catch (err) {
      alert('Error al editar: ' + err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    // Fondo oscuro semitransparente
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-zinc-100">Editar repuesto</h2>
            <p className="text-xs text-zinc-400 mt-0.5">ID #{producto.id} · {producto.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm"
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
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm"
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
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm"
              />
              {errors.precio && <p className="text-xs text-red-400 mt-1">{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm"
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
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm cursor-pointer"
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
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm cursor-pointer"
              >
                <option value="">-- Sin categoría --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
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
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-amber-500 focus:outline-none text-sm cursor-pointer"
              >
                <option value="">-- Sin proveedor --</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {enviando ? 'Guardando...' : '✓ Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
