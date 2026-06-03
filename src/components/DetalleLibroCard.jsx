// COMPONENTE reutilizable — muestra el detalle de cualquier libro
// Se puede usar para todos los libros del catálogo
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from './Alerta'
import { calcularPrecioFinal } from '../utils/calcularPrecio'

// PROPS — recibe los datos del libro y la función del carrito desde el padre
function DetalleLibroCard({ libro, agregarAlCarrito, puedeComprar }) {

  // HOOK useState — controla si se muestra el mensaje de éxito
  const [agregado, setAgregado] = useState(false)

  const precioFinal = calcularPrecioFinal(libro.precioOriginal, libro.descuento)

  // EVENTO — agrega el libro al carrito y muestra mensaje
  // Llama a la función del padre pasada como prop
  const handleAgregar = () => {
    agregarAlCarrito({ ...libro, precio: precioFinal })
    setAgregado(true)
  }

  return (
    <div className="flex gap-16 max-w-5xl mx-auto">

      {/* Imagen del libro */}
      <div className="flex flex-col">
        <div className="bg-white p-8 shadow-sm">
          <img
            src={libro.imagen}
            alt={libro.titulo}
            className="h-96 w-64 object-cover"
          />
        </div>

        {/* Info editorial */}
        <div className="mt-4 border-t border-gray-200">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Editorial</span>
            <span className="text-xs text-gray-600">{libro.editorial}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Autor</span>
            <span className="text-xs text-gray-600">{libro.autor}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Cantidad de hojas</span>
            <span className="text-xs text-gray-600">{libro.hojas}</span>
          </div>
        </div>
      </div>

      {/* Info del libro */}
      <div className="flex-1">

        <h1 className="text-4xl font-bold text-[#2d2640] mb-4" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
          {libro.titulo}
        </h1>

        {/* Precio con descuento
            RENDERIZADO CONDICIONAL con &&  */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl text-[#2d2640]">
            ${precioFinal.toLocaleString()}
          </span>
          {libro.descuento && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ${libro.precioOriginal.toLocaleString()}
              </span>
              <span className="bg-[#7B5B98] text-white text-xs px-2 py-1">
                {libro.descuento}
              </span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          {libro.descripcion}
        </p>

        {/* EVENTO onClick — dispara handleAgregar  */}
        {puedeComprar ? (
          <button
            onClick={handleAgregar}
            className="w-full bg-[#2d2640] text-white py-4 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
          >
            Añadir al carrito
          </button>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4 border border-gray-200">
            Iniciá sesión como usuario para comprar
          </p>
        )}

        {/* RENDERIZADO CONDICIONAL con &&  */}
        {agregado && (
          <Alerta
            texto="¡Libro agregado al Carrito!"
            linkTexto="Ver Carrito"
            linkRuta="/carrito"
          />
        )}

      </div>
    </div>
  )
}

export default DetalleLibroCard