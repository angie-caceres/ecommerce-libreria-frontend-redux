// COMPONENTE reutilizable — muestra una fila de libro en cualquier vista
// Se usa en ResumenCompra con editable=true (carrito) o editable=false (checkout/pedido)

// PROPS — recibe el item, si es editable y las funciones del padre
function ItemCompra({ item, editable, cambiarCantidad, eliminarDelCarrito }) {

  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-200">

      {/* Imagen y datos del libro */}
      <div className="flex items-center gap-4 w-1/2">
        <img
          src={item.imagen}
          alt={item.titulo}
          className="h-20 w-14 object-cover"
        />
        <div>
          <p className="text-sm font-medium text-[#2d2640]">{item.titulo}</p>
          {/* RENDERIZADO CONDICIONAL con &&
              Solo muestra precio original tachado si tiene descuento  */}
          {item.precioOriginal && item.descuento && (
            <p className="text-xs text-gray-400 line-through">
              ${item.precioOriginal.toLocaleString()}
            </p>
          )}

          {/* RENDERIZADO CONDICIONAL con &&
              Solo muestra el botón eliminar si es editable  */}
          {editable && (
            <button
              onClick={() => eliminarDelCarrito(item.id)}
              className="text-xs text-red-400 hover:text-red-600 mt-1 uppercase tracking-wider"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL con ternario
          Si es editable muestra botones de cantidad, sino solo el número  */}
      {editable ? (
        <div className="flex items-center gap-3">
          {/* EVENTO onClick — reduce la cantidad  */}
          <button
            onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
            className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            −
          </button>
          <span className="text-sm w-4 text-center">{item.cantidad}</span>
          <button
            onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
            className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Cant: {item.cantidad}</span>
      )}

      {/* Subtotal — usa item.precio que ya viene calculado con descuento */}
      <span className="text-sm text-[#2d2640] font-medium">
        ${(item.precio * item.cantidad).toLocaleString()}
      </span>

    </div>
  )
}

// EXPORTACIÓN del componente
export default ItemCompra