// VISTA — página de checkout
// Permite seleccionar método de pago y confirmar la compra
// Renderizando componentes dentro de otros

import { useState } from 'react'
import { Link } from 'react-router-dom'

function Checkout({ carrito }) {

  // HOOK useState — método de pago seleccionado
  // Estados locales y props - useState
  const [metodoPago, setMetodoPago] = useState('tarjeta')

  // HOOK useState — controla mensaje final
  const [compraConfirmada, setCompraConfirmada] = useState(false)

  // Cálculo del subtotal
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const envio = 2400
  const descuento = 2000

  const total =
    subtotal + envio - descuento

  const handleConfirmarCompra = () => {
    setCompraConfirmada(true)
  }

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-12">

      <h1
        className="text-6xl text-center text-[#4E3B67] mb-16"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Checkout
      </h1>

      <div className="max-w-7xl mx-auto flex gap-10">

        {/* COLUMNA IZQUIERDA */}

        <div className="flex-1">

          <h2
            className="text-4xl text-[#2d2640] mb-6"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Método de Pago
          </h2>

          <div className="border-t border-gray-200 mb-6"></div>

          {/* Tarjeta / Mercado Pago */}

          <div className="grid grid-cols-2 gap-4 mb-10">

            <button
              onClick={() => setMetodoPago('tarjeta')}
              className={
                metodoPago === 'tarjeta'
                  ? 'border-2 border-[#7B5B98] bg-[#F1E9F6] p-6 text-left'
                  : 'border border-gray-300 bg-white p-6 text-left'
              }
            >
              <p className="font-semibold uppercase text-sm">
                Tarjeta de Crédito
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Visa, Mastercard, Amex
              </p>
            </button>

            <button
              onClick={() => setMetodoPago('mercadopago')}
              className={
                metodoPago === 'mercadopago'
                  ? 'border-2 border-[#7B5B98] bg-[#F1E9F6] p-6 text-left'
                  : 'border border-gray-300 bg-white p-6 text-left'
              }
            >
              <p className="font-semibold uppercase text-sm">
                Mercado Pago
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Dinero en cuenta o cuotas
              </p>
            </button>

          </div>

          {/* Datos tarjeta */}

          <div className="grid grid-cols-2 gap-4 mb-12">

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">
                Nombre en la tarjeta
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 p-3 mt-2 bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">
                Número de tarjeta
              </label>

              <input
                type="text"
                placeholder="**** **** **** ****"
                className="w-full border border-gray-300 p-3 mt-2 bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">
                Vencimiento
              </label>

              <input
                type="text"
                placeholder="MM / AA"
                className="w-full border border-gray-300 p-3 mt-2 bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">
                CVV
              </label>

              <input
                type="text"
                placeholder="000"
                className="w-full border border-gray-300 p-3 mt-2 bg-white"
              />
            </div>

          </div>

          {/* ENVÍO */}

          <div>

            <div className="flex justify-between items-center mb-4">

              <h2
                className="text-4xl text-[#2d2640]"
                style={{ fontFamily: "'Libre Caslon Text', serif" }}
              >
                Envío
              </h2>

              <button className="border border-gray-400 px-3 py-1 text-xs uppercase">
                Editar
              </button>

            </div>

            <div className="bg-white border border-gray-200 p-6">

              <p className="text-gray-700">
                Av. del Libertador 1450, Piso 4B
              </p>

              <p className="text-gray-500">
                C1425 Buenos Aires, Argentina
              </p>

              <p className="text-sm text-gray-400 mt-4">
                Entrega estimada: 3 a 5 días hábiles.
              </p>

            </div>

          </div>

        </div>

        {/* RESUMEN */}

        <div className="w-[380px] bg-white border border-gray-200 p-8">

          <h2
            className="text-3xl text-[#2d2640] mb-8"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Resumen de Compra
          </h2>

          {carrito.map(item => (

            <div
              key={item.id}
              className="flex gap-4 py-5 border-b border-gray-200"
            >

              <img
                src={item.imagen}
                alt={item.titulo}
                className="w-16 h-24 object-cover"
              />

              <div className="flex-1">

                <h3 className="font-semibold text-[#2d2640]">
                  {item.titulo}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.autor}
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Cant: {item.cantidad}
                </p>

              </div>

              <span className="font-medium text-[#2d2640]">
                ${(item.precio * item.cantidad).toLocaleString()}
              </span>

            </div>

          ))}

          <div className="mt-8 space-y-4 text-sm">

            <div className="flex justify-between">
              <span>SUBTOTAL</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>ENVÍO</span>
              <span>${envio.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>DESCUENTO</span>
              <span>-${descuento.toLocaleString()}</span>
            </div>

          </div>

          <div className="border-t-2 border-[#2d2640] mt-6 pt-6 flex justify-between">

            <span className="font-semibold">
              TOTAL
            </span>

            <span className="font-bold text-3xl text-[#2d2640]">
              ${total.toLocaleString()}
            </span>

          </div>

          <button
            onClick={handleConfirmarCompra}
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

          {compraConfirmada && (

            <div className="bg-purple-100 text-purple-700 p-4 mt-4 rounded">

              ✓ Compra realizada correctamente

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default Checkout