import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

export default function Home() {
  const { user } = useContext(UserContext)

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 max-w-5xl mx-auto text-center">
      <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
        🚗 Repuestos Originales & Alternativos para Autos y Motos 🏍️
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-100 tracking-tight">
        Todo lo que tu vehículo necesita en un solo lugar
      </h1>

      <p className="text-zinc-400 text-lg mt-4 max-w-2xl">
        Consultá nuestro catálogo en tiempo real conectado a nuestra API REST en FastAPI.
        Frenos, suspensión, motor, transmisión y mucho más.
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          to="/productos"
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-amber-500/20"
        >
          Explorar Catálogo
        </Link>
        {user.admin && (
          <Link
            to="/crear"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            + Cargar Repuesto
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
        <div className="bg-zinc-800/50 border border-zinc-700/60 p-6 rounded-xl">
          <span className="text-3xl">🚗</span>
          <h3 className="text-lg font-bold text-zinc-100 mt-2">Línea Autos</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Pastillas de freno, embragues, filtros, amortiguadores y accesorios para todas las marcas.
          </p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/60 p-6 rounded-xl">
          <span className="text-3xl">🏍️</span>
          <h3 className="text-lg font-bold text-zinc-100 mt-2">Línea Motos</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Kits de transmisión, bujías, cubiertas, discos y fluidos de alta competición y calle.
          </p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/60 p-6 rounded-xl">
          <span className="text-3xl">⚡</span>
          <h3 className="text-lg font-bold text-zinc-100 mt-2">Stock en Vivo</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Integrado directamente con base de datos SQLite y endpoints documentados en Swagger.
          </p>
        </div>
      </div>
    </main>
  )
}
