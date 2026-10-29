import { useOutletContext } from 'react-router-dom'

export default function ProductoDetalleDesc() {
  const producto = useOutletContext()

  return (
    <div className="bg-zinc-800/50 p-5 rounded-lg border border-zinc-700/60">
      <h3 className="font-bold text-amber-400 mb-2 text-lg">Descripción detallada</h3>
      <p className="text-zinc-300 leading-relaxed">{producto.descripcion}</p>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800">
          <p className="text-zinc-500 text-xs">Identificador</p>
          <p className="font-mono text-zinc-200"># {producto.id}</p>
        </div>
        <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800">
          <p className="text-zinc-500 text-xs">Unidades en depósito</p>
          <p className="font-bold text-zinc-200">{producto.stock} u.</p>
        </div>
      </div>
    </div>
  )
}
