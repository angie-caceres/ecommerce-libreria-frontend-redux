// VISTA — página del carrito de compras
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { Link } from 'react-router-dom'
import { calcularPrecioFinal } from '../components/ResumenCompra'

// PROPS — recibe carrito, eliminarDelCarrito y cambiarCantidad del padre App.jsx
// (PDF: Estados locales y props - ¿Qué son las props?)
function Carrito({ carrito, eliminarDelCarrito, cambiarCantidad }) {

  // Calcula el total del carrito
  // reduce() recorre el array sumando precioFinal * cantidad de cada item
  // (PDF: Estados locales y props - Estado)
  const total = carrito.reduce((acc, item) => {
    const precio = calcularPrecioFinal(item.precioOriginal, item.descuento)
    return acc + precio * item.cantidad
  }, 0)

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <h1 className="text-3xl font-bold text-[#2d2640] mb-8">Mi Carrito</h1>

      {/* RENDERIZADO CONDICIONAL con ternario
          Si el carrito está vacío muestra mensaje, sino muestra los items
          (PDF: Renderizado condicional - Operador ternario) */}
      {carrito.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
          <Link
            to="/catalogo"
            className="bg-[#2d2640] text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="flex gap-8">

          {/* Lista de libros en el carrito */}
          <div className="flex-1">

            {/* Encabezado de la tabla */}
            <div className="flex justify-between pb-3 border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
              <span className="w-1/2">Obras seleccionadas</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
            </div>

            {/* RENDERIZADO DE LISTA con .map()
                Cada item del carrito se renderiza como una fila
                (PDF: Renderizado condicional - Listas) */}
            {carrito.map((item) => {
              // Calculamos el precio final aplicando el descuento del libro
              const precio = calcularPrecioFinal(item.precioOriginal, item.descuento)
              return (
                <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-200">

                  {/* Imagen y datos del libro */}
                  <div className="flex items-center gap-4 w-1/2">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="h-20 w-14 object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#2d2640]">{item.titulo}</p>
                      <p className="text-xs text-gray-400">{item.autor}</p>
                      {/* EVENTO onClick — elimina el item del carrito
                          Llama a función del padre pasada como prop
                          (PDF: Estados locales y props - Flujo unidireccional) */}
                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 uppercase tracking-wider"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-3">
                    {/* EVENTO onClick — reduce la cantidad
                        (PDF: Estados locales y props - Eventos) */}
                    <button
                      onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                      className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{item.cantidad}</span>
                    {/* EVENTO onClick — aumenta la cantidad */}
                    <button
                      onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                      className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal del item */}
                  <span className="text-sm text-[#2d2640] font-medium">
                    ${(precio * item.cantidad).toLocaleString()}
                  </span>

                </div>
              )
            })}
          </div>

          {/* Recuadro total del carrito */}
          <div className="w-72">
            <div className="bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2d2640] mb-6">Total del Carrito</h2>

              <div className="flex justify-between py-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-sm font-medium text-[#2d2640]">
                  ${total.toLocaleString()}
                </span>
              </div>

              {/* Botón checkout */}
              <Link to="/checkout" className="w-full bg-[#2d2640] text-white py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition mt-4 flex items-center justify-center gap-2">
                Checkout →
              </Link>

              {/* Pago seguro */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                PAGO SEGURO
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default Carrito