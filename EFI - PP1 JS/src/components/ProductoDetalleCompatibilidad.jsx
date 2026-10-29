import { useOutletContext } from 'react-router-dom'

export default function ProductoDetalleCompatibilidad() {
  const producto = useOutletContext()

  return (
    <div className="bg-zinc-800/50 p-5 rounded-lg border border-zinc-700/60 space-y-4">
      <div>
        <h3 className="font-bold text-amber-400 text-lg mb-1">Compatibilidad vehicular</h3>
        <p className="text-zinc-300 text-sm">
          Este repuesto está homologado para su uso en: <strong className="text-amber-300 font-bold">{producto.compatibilidad}</strong>.
        </p>
      </div>

      {producto.proveedor && (
        <div className="mt-4 pt-4 border-t border-zinc-700/60">
          <h4 className="font-bold text-zinc-200 text-sm mb-2">Información del Proveedor</h4>
          <div className="text-sm text-zinc-400 space-y-1">
            <p>Empresa: <strong className="text-zinc-200">{producto.proveedor.nombre}</strong></p>
            <p>Email: <span className="text-zinc-300 font-mono">{producto.proveedor.email}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
