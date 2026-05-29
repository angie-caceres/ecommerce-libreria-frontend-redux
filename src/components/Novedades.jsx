// COMPONENTE — importa LibroCard desde su propio archivo
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { Link } from 'react-router-dom'
import LibroCard from './LibroCard'

const libros = [
  {
    id: 1,
    categoria: 'CLÁSICOS MODERNOS',
    titulo: 'Amanecer en la cosecha',
    precio: 36000,
    precioOriginal: 40000,
    descuento: '-10%',
    imagen: '/libros/juegos.png',
    tieneDetalle: true,
  },
  {
    id: 2,
    categoria: 'POESÍA',
    titulo: 'Estrofas de Silencio',
    precio: 64000,
    precioOriginal: null,
    descuento: null,
    imagen: '/libros/estrofas-silencio.png',
  },
  {
    id: 3,
    categoria: 'FILOSOFÍA',
    titulo: 'Ecos de la Razón',
    precio: 120000,
    precioOriginal: 150000,
    descuento: '-20%',
    imagen: '/libros/ecos-razon.png',
  },
  {
    id: 4,
    categoria: 'CURADURÍAS',
    titulo: 'El Folio del Vagabundo',
    precio: 92000,
    precioOriginal: null,
    descuento: null,
    imagen: '/libros/folio-vagabundo.png',
  },
]

function Novedades() {
  return (
    <div className="px-12 py-12 bg-[#FCF9F8]">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#4A0E0E]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>Novedades</h2>
          <div className="w-12 h-1 bg-[#7B5B98] mt-2" />
        </div>
        <Link to="/catalogo" className="text-xs text-gray-500 uppercase tracking-wider hover:text-purple-600">
          VER COLECCIÓN COMPLETA →
        </Link>
      </div>

      {/* RENDERIZADO DE LISTA con .map()
          Cada libro se renderiza como LibroCard
          Se pasan los datos como PROPS al componente hijo
          (PDF: Renderizado condicional - Listas / Estados locales y props - Props) */}
      <div className="grid grid-cols-4 gap-6">
        {libros.map((libro) => (
          <LibroCard
            key={libro.id}
            id={libro.id}
            categoria={libro.categoria}
            titulo={libro.titulo}
            precio={libro.precio}
            precioOriginal={libro.precioOriginal}
            descuento={libro.descuento}
            imagen={libro.imagen}
            tieneDetalle={libro.tieneDetalle}
          />
        ))}
      </div>

    </div>
  )
}

export default Novedades