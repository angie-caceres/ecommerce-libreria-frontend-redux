// COMPONENTE reutilizable — cuadro de resumen de compra
// Se usa en Carrito, Checkout y ConfirmacionPedido
// (PDF: Exposición de experto - Componentes reutilizables)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from './Alerta'
import ItemCompra from './ItemCompra'

function ResumenCompra({ 
  carrito, 
  editable = false,
  mostrarEnvio = false,
  mostrarBoton = false,
  confirmado = false,
  onConfirmar,
  cambiarCantidad,
  eliminarDelCarrito,
  titulo = 'Resumen de Compra'
}) {

  // HOOK useState — controla la visibilidad del banner de confirmación
  // (PDF: Estados locales y props - useState)
  const [bannerVisible, setBannerVisible] = useState(confirmado)

  // Calcula el subtotal — item.precio ya viene con descuento aplicado
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  // Calcula el descuento total para mostrarlo como ahorro informativo
  // No se resta del total — ya está incluido en item.precio
  const descuentoTotal = carrito.reduce((acc, item) => {
    if (!item.precioOriginal || !item.descuento) return acc
    return acc + (item.precioOriginal - item.precio) * item.cantidad
  }, 0)

  const envio = 2400

  // RENDERIZADO CONDICIONAL — total con o sin envío según la vista
  // (PDF: Renderizado condicional - Operador ternario)
  const total = mostrarEnvio ? subtotal + envio : subtotal

  return (
    <div className="bg-white border border-gray-200 p-8">

      <h2
        className="text-3xl text-[#2d2640] mb-8"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        {titulo}
      </h2>

      {/* RENDERIZADO CONDICIONAL con &&
          Solo muestra el banner si la compra fue confirmada
          (PDF: Renderizado condicional - Operador &&) */}
      {bannerVisible && (
        <Alerta
          texto="Compra confirmada. En breve recibirás un mail con el detalle del envío."
          onClose={() => setBannerVisible(false)}
        />
      )}

      {/* RENDERIZADO DE LISTA con .map()
          Cada item se renderiza como ItemCompra
          Se pasan datos como PROPS al hijo
          (PDF: Renderizado condicional - Listas / Estados locales y props - Props) */}
      {carrito.map(item => (
        <ItemCompra
          key={item.id}
          item={item}
          editable={editable}
          cambiarCantidad={cambiarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
        />
      ))}

      {/* Totales */}
      <div className="mt-8 space-y-4 text-sm">
        <div className="flex justify-between">
          <span>SUBTOTAL</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra envío en Checkout y Pedido
            (PDF: Renderizado condicional - Operador &&) */}
        {mostrarEnvio && (
          <div className="flex justify-between">
            <span>ENVÍO</span>
            <span>${envio.toLocaleString()}</span>
          </div>
        )}

        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra el descuento si hubo alguno
            (PDF: Renderizado condicional - Operador &&) */}
        {descuentoTotal > 0 && (
          <div className="flex justify-between text-[#7B5B98]">
            <span>DESCUENTO APLICADO</span>
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

      {/* RENDERIZADO CONDICIONAL con &&
          Solo muestra botones en Checkout
          (PDF: Renderizado condicional - Operador &&) */}
      {mostrarBoton && (
        <>
          <button
            onClick={onConfirmar}
            className="w-full bg-[#2d2640] text-white py-4 text-sm uppercase tracking-widest hover:bg-purple-800 transition mt-6"
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