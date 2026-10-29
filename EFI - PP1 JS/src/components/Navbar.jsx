import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'

export default function Navbar() {
  const linkStyle = ({ isActive }) =>
    isActive
      ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-1'
      : 'cursor-pointer text-zinc-300 hover:text-amber-400 transition-colors pb-1'

  const { totalItems } = useContext(CartContext)
  const { user, toggleAdmin } = useContext(UserContext)

  return (
    <nav className="flex justify-between items-center bg-zinc-950 px-6 py-4 border-b border-zinc-800 shadow-xl">
      <Link to="/" className="flex items-center gap-2 text-xl font-black text-amber-500 hover:text-amber-400 transition-colors">
        <span>🔧</span>
        <span>MotoAuto Repuestos</span>
      </Link>

      <ul className="flex items-center gap-6 text-sm font-medium">
        <NavLink to="/" className={linkStyle}>Inicio</NavLink>
        <NavLink to="/productos" className={linkStyle}>Catálogo</NavLink>
        <NavLink to="/categorias" className={linkStyle}>Categorías</NavLink>
        <NavLink to="/proveedores" className={linkStyle}>Proveedores</NavLink>
        {user.admin && (
          <NavLink to="/crear" className={linkStyle}>+ Agregar Repuesto</NavLink>
        )}
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleAdmin}
          title="Cambiar rol para probar permisos"
          className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
        >
          Rol: <strong className={user.admin ? 'text-green-400' : 'text-zinc-400'}>{user.admin ? 'Admin' : 'Usuario'}</strong>
        </button>

        <Link
          to="/cart"
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>🛒</span>
          {totalItems > 0 ? (
            <span>Carrito ({totalItems})</span>
          ) : (
            <span>Mi Carrito</span>
          )}
        </Link>
      </div>
    </nav>
  )
}
