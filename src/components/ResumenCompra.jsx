// COMPONENTE reutilizable — cuadro de resumen de compra
// Usado en Checkout.jsx y ConfirmacionPedido.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom'

  // Calcula el precio final de un item a partir de precioOriginal y descuento
  // descuento viene como string '-10%' → aplica el porcentaje
  export function calcularPrecioFinal(precioOriginal, descuento) {
    if (!descuento) return precioOriginal
    const porcentaje = parseInt(descuento) // '-10%' → -10
    return precioOriginal * (1 + porcentaje / 100)
  }

function ResumenCompra({ carrito, onConfirmar, mostrarBoton = true, confirmado = false }) {

  // Controla la visibilidad del banner de confirmación
  const [bannerVisible, setBannerVisible] = useState(confirmado)

  const subtotal = carrito.reduce((acc, item) => {
    const precio = calcularPrecioFinal(item.precioOriginal, item.descuento)
    return acc + precio * item.cantidad
  }, 0)

  const envio = 2400
  const descuentoTotal = carrito.reduce((acc, item) => {
    if (!item.descuento) return acc
    const porcentaje = parseInt(item.descuento)
    const ahorro = item.precioOriginal * Math.abs(porcentaje) / 100
    return acc + ahorro * item.cantidad
  }, 0)

  const total = subtotal + envio

  return (
    <div className="bg-white border border-gray-200 p-8">

      <h2
        className="text-3xl text-[#2d2640] mb-8"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Resumen de Compra
      </h2>

      {/* Banner de confirmación — se cierra con la X */}
      {bannerVisible && (
        <div className="flex items-center justify-between bg-[#F1E9F6] border border-[#C4A8E0] px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B5B98] shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-[#4E3B67]">
              Compra confirmada. En breve recibirás un mail con el detalle del envío.
            </p>
          </div>
          <button
            onClick={() => setBannerVisible(false)}
            className="text-[#7B5B98] text-xl leading-none ml-4 hover:text-[#4E3B67] transition"
          >
            ×
          </button>
        </div>
      )}

       {/* Items del carrito */}
      {carrito.map(item => {
        const precioFinal = calcularPrecioFinal(item.precioOriginal, item.descuento)
        return (
          <div key={item.id} className="flex gap-4 py-5 border-b border-gray-200">
            <img
              src={item.imagen}
              alt={item.titulo}
              className="w-16 h-24 object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-[#2d2640]">{item.titulo}</h3>
              <p className="text-sm text-gray-500">{item.autor}</p>
              <p className="text-sm text-gray-500 mt-4">Cant: {item.cantidad}</p>
            </div>
            <span className="font-medium text-[#2d2640]">
              ${(precioFinal * item.cantidad).toLocaleString()}
            </span>
          </div>
        )
      })}
 
      {/* Totales */}
      <div className="mt-8 space-y-4 text-sm">
        <div className="flex justify-between">
          <span>SUBTOTAL</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>ENVÍO</span>
          <span>${envio.toLocaleString()}</span>
        </div>
        {descuentoTotal > 0 && (
          <div className="flex justify-between text-[#7B5B98]">
            <span>DESCUENTO</span>
            <span>-${descuentoTotal.toLocaleString()}</span>
          </div>
        )}
      </div>
 
      <div className="border-t-2 border-[#2d2640] mt-6 pt-6 flex justify-between">
        <span className="font-semibold">TOTAL</span>
        <span className="font-bold text-3xl text-[#2d2640]">
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Botón confirmar — solo en Checkout */}
      {mostrarBoton && (
        <>
          <button
            onClick={onConfirmar}
            className="w-full bg-[#4E3B67] text-white py-4 mt-10 uppercase tracking-widest text-sm hover:bg-[#7B5B98] transition"
          >
            Confirmar compra
          </button>

          <Link
            to="/carrito"
            className="block text-center bg-white border border-gray-300 py-4 mt-4 text-sm uppercase tracking-widest text-gray-500"
          >
            Cancelar y volver al carrito
          </Link>
        </>
      )}

    </div>
  )
}

export default ResumenCompra