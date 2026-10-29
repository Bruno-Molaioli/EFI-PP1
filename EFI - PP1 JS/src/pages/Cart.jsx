import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
    useContext(CartContext)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-100">Mi Carrito de Repuestos</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {totalItems} {totalItems === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1.5 rounded-lg border border-red-900 bg-red-950/40 cursor-pointer"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-12 text-center my-8">
          <p className="text-5xl">🛒</p>
          <h2 className="text-xl font-bold text-zinc-300 mt-4">Tu carrito está vacío</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Navegá por nuestro catálogo y agregá repuestos para presupuestar.
          </p>
          <Link
            to="/productos"
            className="inline-block mt-6 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800/80 border border-zinc-700/60 p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <span className="text-xs text-amber-400 font-semibold">
                    {item.compatibilidad}
                  </span>
                  <h3 className="font-bold text-zinc-100 text-base">{item.nombre}</h3>
                  <p className="text-sm text-zinc-400">
                    ${Number(item.precio).toLocaleString('es-AR')} c/u
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-zinc-400 hover:text-zinc-200 px-1.5 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-zinc-400 hover:text-zinc-200 px-1.5 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <p className="font-black text-amber-400 w-24 text-right">
                  ${Number(item.precio * item.quantity).toLocaleString('es-AR')}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-2 cursor-pointer"
                  title="Quitar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="bg-zinc-800/80 border border-zinc-700/60 p-6 rounded-2xl h-fit space-y-4">
            <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-700 pb-3">
              Resumen del Pedido
            </h2>

            <div className="flex justify-between text-sm text-zinc-400">
              <span>Total de unidades:</span>
              <strong className="text-zinc-200">{totalItems}</strong>
            </div>

            <div className="flex justify-between items-baseline text-lg font-black text-zinc-100 border-t border-zinc-700 pt-3">
              <span>Total estimado:</span>
              <span className="text-2xl text-amber-400">
                ${Number(totalPrice).toLocaleString('es-AR')}
              </span>
            </div>

            <button
              onClick={() => alert('¡Presupuesto confirmado! Se conectará con el checkout.')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
