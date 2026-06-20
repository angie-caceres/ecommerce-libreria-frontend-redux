// VISTA — página de resultados de búsqueda
// Lee el parámetro ?q= de la URL con useSearchParams
import { useSearchParams } from 'react-router-dom'
import { libros } from '../data/libros'
import LibroCard from '../components/LibroCard'

function Busqueda() {

  // useSearchParams — lee los parámetros de la URL
  // Por ejemplo: /busqueda?q=hobbit → query = "hobbit"

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // Filtra los libros según el texto buscado
  // Mismo criterio que el buscador del Navbar — título y autor

  const resultados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(query.toLowerCase()) ||
    libro.autor.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-12">

      {/* Título con el texto buscado */}
      <h1
        className="text-3xl text-[#2d2640] mb-2"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Resultados para "{query}"
      </h1>

      {/* RENDERIZADO CONDICIONAL con ternario
          Muestra cantidad de resultados o mensaje de no encontrado*/}
      <p className="text-sm text-gray-400 mb-10">
        {resultados.length > 0
          ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`
          : 'No se encontraron resultados'
        }
      </p>

      {/* RENDERIZADO CONDICIONAL con &&
          Solo muestra la grilla si hay resultados*/}
      {resultados.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* RENDERIZADO DE LISTA con .map()*/}
          {resultados.map(libro => (
            <LibroCard
              key={libro.id}
              id={libro.id}
              titulo={libro.titulo}
              precio={libro.precioOriginal}
              precioOriginal={libro.precioOriginal}
              descuento={libro.descuento}
              imagen={libro.imagen}
              categoria={libro.categoria}
              tieneDetalle={true}
            />
          ))}
        </div>
      )}

      {/* RENDERIZADO CONDICIONAL con &&
          Solo muestra el mensaje si no hay resultados */}
      {resultados.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No encontramos libros para "{query}"</p>
          <p className="text-gray-300 text-sm">Intentá con otro título o autor</p>
        </div>
      )}

    </div>
  )
}

export default Busqueda