// VISTA — página de detalle de un libro
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { calcularPrecioFinal } from '../components/ResumenCompra'

// DATOS hardcodeados — en el futuro vendrían de una API con useEffect
// (PDF: useEffect - Llamadas a APIs)
const libros = [
  {
    id: 1,
    titulo: 'Amanecer en la cosecha',
    autor: 'Suzanne Collins',
    editorial: 'Planeta',
    hojas: 460,
    precioOriginal: 40000,
    descuento: '-10%',
    descripcion: 'Una obra maestra definitiva de la filosofía moderna, esta primera edición limitada está encuadernada en cuero de ternera de color burdeos profundo, obtenido de forma ética. Con bordes de pan de oro de 24 quilates dorados a mano y un prólogo del descendiente directo del autor, representa la cumbre de la fabricación artesanal de libros.',
    imagen: '/libros/juegos.png',
  },
]

// PROPS — recibe agregarAlCarrito del padre App.jsx
// (PDF: Estados locales y props - ¿Qué son las props?)
function DetalleLibro({ agregarAlCarrito }) {

  // HOOK useState — controla si se muestra el mensaje de éxito
  // (PDF: Estados locales y props - useState)
  const [agregado, setAgregado] = useState(false)

  // Por ahora mostramos el primer libro — después usaríamos useParams
  const libro = libros[0]

  const precioFinal = calcularPrecioFinal(libro.precioOriginal, libro.descuento)

  // EVENTO — agrega el libro al carrito y muestra mensaje
  // Llama a la función del padre pasada como prop
  // (PDF: Estados locales y props - Flujo unidireccional)
  const handleAgregar = () => {
    agregarAlCarrito(libro)
    setAgregado(true)
  }

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      {/* Link volver */}
      <Link to="/" className="text-sm text-gray-500 hover:text-purple-600 mb-8 inline-block">
        ← VOLVER
      </Link>

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

          {/* Info editorial debajo de la imagen */}
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

          {/* Precio con descuento */}
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

          {/* EVENTO onClick — dispara handleAgregar
              (PDF: Estados locales y props - Eventos) */}
          <button
            onClick={handleAgregar}
            className="w-full bg-[#2d2640] text-white py-4 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
          >
            Añadir al carrito
          </button>

          {/* RENDERIZADO CONDICIONAL con &&
              Muestra mensaje de éxito solo si se agregó al carrito
              (PDF: Renderizado condicional - Operador &&) */}
          {agregado && (
            <div className="bg-purple-100 text-purple-700 px-4 py-3 rounded mt-4 flex items-center justify-between">
              <span>✓ ¡Libro agregado al Carrito!</span>
              <Link to="/carrito" className="text-sm underline hover:text-purple-900">
                Ver Carrito
              </Link>
            </div>
          )}


        </div>
      </div>

    </div>
  )
}

export default DetalleLibro