// COMPONENTE — función JavaScript que devuelve JSX
// Nombre en PascalCase, archivo propio
import { useState } from 'react'
import { Link } from 'react-router-dom'

// DATOS del carrusel — array de objetos con la info de cada slide
// En el futuro esto vendría de una API
const slides = [
  {
    id: 1,
    titulo: 'Colecciones Destacadas: Joyas de la Literatura',
    descripcion: 'Explore nuestra exclusiva selección de primeras ediciones y manuscritos raros. Cada volumen ha sido cuidadosamente autenticado para ofrecer a los bibliófilos más exigentes una conexión tangible con la historia literaria universal.',
    boton: 'EXPLORAR CATÁLOGO',
    link: '/catalogo',
    imagen1: '/carrusel/rayuela.png',
    imagen2: '/carrusel/harry.png',
  },
  {
    id: 2,
    titulo: 'Oriana Sabatini presenta su libro',
    descripcion: 'Nació en Buenos Aires, Argentina, en 1996. Es cantante, compositora y actriz. Podría quedarme acá es su primera novela.',
    boton: 'CONSEGUILO ACÁ',
    link: '/catalogo',
    imagen1: '/carrusel/oriana.png',
    imagen2: '/carrusel/firma.png',
  },
  {
    id: 3,
    titulo: '¡Alentá a la Scaloneta!',
    descripcion: 'Libro con divertidas actividades, stickers y un llavero de silicona de AFA de regalo.',
    boton: 'CONSEGUILO ACÁ',
    link: '/catalogo',
    imagen1: '/carrusel/scaloneta.jpg',
    imagen2: '/carrusel/scaloneta-llavero.png',
  },
]

function Carrusel() {

  // HOOK useState — guarda el índice del slide actual
  const [current, setCurrent] = useState(0)

  // EVENTOS — actualizan el estado al hacer click en las flechas
  // Nunca se modifica el estado directamente
  const handlePrev = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1)
  }

  const handleNext = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1)
  }

  return (
    <div className="relative flex items-center justify-center px-16 py-16 bg-[#FCF9F8] min-h-[500px]">

      {/* EVENTO onClick — dispara handlePrev */}
      <button
        onClick={handlePrev}
        className="absolute left-4 text-gray-400 hover:text-purple-600 text-3xl z-10"
      >
        ‹
      </button>

      {/* RENDERIZADO CONDICIONAL — solo muestra el slide activo  */}
      {slides.map((slide, index) => (
        index === current && (
          <div key={slide.id} className="flex items-center justify-between w-full max-w-5xl gap-12">

            {/* Texto del slide */}
            <div className="flex-1 max-w-md">
              <h1 className="text-4xl font-bold text-[#2d2640] mb-4 leading-tight" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                {slide.titulo}
              </h1>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {slide.descripcion}
              </p>
              {/* COMPONENTE Link — navega sin recargar */}
              <Link
                to={slide.link}
                className="bg-[#2d2640] text-white text-sm px-6 py-3 hover:bg-purple-800 transition"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {slide.boton}
              </Link>
            </div>

            {/* Imágenes con efecto inclinado */}
            <div className="flex-1 flex justify-center items-center relative h-96">

              {/* RENDERIZADO CONDICIONAL con ternario
                  Si hay segunda imagen usa tamaño normal, sino usa tamaño grande  */}
              <div className={`bg-white shadow-xl p-3 relative z-10 ${slide.imagen2 ? '-rotate-6' : '-rotate-3'}`}>
                <img
                  src={slide.imagen1}
                  alt={slide.titulo}
                  className={`object-cover ${slide.imagen2 ? 'h-64 w-48' : 'h-80 w-56'}`}
                />
              </div>

              {/* RENDERIZADO CONDICIONAL con &&
                  Solo muestra segunda imagen si existe  */}
              {slide.imagen2 && (
                <div className="bg-white shadow-xl p-3 absolute right-4 top-4 z-0 rotate-6">
                  <img
                    src={slide.imagen2}
                    alt={slide.titulo}
                    className="h-64 w-48 object-cover"
                  />
                </div>
              )}

            </div>

          </div>
        )
      ))}

      {/* EVENTO onClick — dispara handleNext */}
      <button
        onClick={handleNext}
        className="absolute right-4 text-gray-400 hover:text-purple-600 text-3xl z-10"
      >
        ›
      </button>

      {/* Dots — RENDERIZADO DE LISTA con .map() + ternario  */}
      <div className="absolute bottom-6 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={index === current
              ? 'w-3 h-3 rounded-full bg-purple-500'
              : 'w-3 h-3 rounded-full bg-gray-300'
            }
          />
        ))}
      </div>

    </div>
  )
}

// EXPORTACIÓN del componente
export default Carrusel