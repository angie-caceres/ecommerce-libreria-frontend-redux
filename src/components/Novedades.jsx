// COMPONENTE — función JavaScript que devuelve JSX
// Nombre en PascalCase, archivo propio (PDF: Exposición de experto - Componentes)
import { Link } from 'react-router-dom'

// DATOS de los libros — array de objetos
// En el futuro esto vendría de una API con useEffect (PDF: useEffect - Llamadas a APIs)
const libros = [
  {
    id: 1,
    categoria: 'CLÁSICOS MODERNOS',
    titulo: 'El Archivo de Medianoche',
    precio: 85.00,
    precioOriginal: 100.00,
    descuento: '-15%',
    imagen: '/libros/archivo-medianoche.png',
  },
  {
    id: 2,
    categoria: 'POESÍA',
    titulo: 'Estrofas de Silencio',
    precio: 64.00,
    precioOriginal: null,
    descuento: null,
    imagen: '/libros/estrofas-silencio.png',
  },
  {
    id: 3,
    categoria: 'FILOSOFÍA',
    titulo: 'Ecos de la Razón',
    precio: 120.00,
    precioOriginal: 150.00,
    descuento: '-20%',
    imagen: '/libros/ecos-razon.png',
  },
  {
    id: 4,
    categoria: 'CURADURÍAS',
    titulo: 'El Folio del Vagabundo',
    precio: 92.00,
    precioOriginal: null,
    descuento: null,
    imagen: '/libros/folio-vagabundo.png',
  },
]

// COMPONENTE hijo — recibe props del componente padre (Novedades)
// Las props son de solo lectura, no se pueden modificar desde acá
// (PDF: Estados locales y props - ¿Qué son las props?)
function LibroCard({ categoria, titulo, precio, precioOriginal, descuento, imagen }) {
  return (
    <div className="flex flex-col">

      {/* Imagen con badge de descuento */}
      <div className="relative">
        <img
          src={imagen}
          alt={titulo}
          className="w-full h-64 object-cover"
        />

        {/* RENDERIZADO CONDICIONAL con operador &&
            Solo muestra el badge si existe descuento
            (PDF: Renderizado condicional - Operador &&) */}
        {descuento && (
          <span className="absolute top-3 right-3 bg-[#7B5B98] text-white text-xs px-2 py-1">
            {descuento}
          </span>
        )}
      </div>

      {/* Info del libro */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {categoria}
        </p>
        <h3 className="text-sm font-medium text-[#2d2640] mb-1">
          {titulo}
        </h3>

        {/* Precios */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#2d2640]">
            ${precio.toFixed(2)}
          </span>

          {/* RENDERIZADO CONDICIONAL con operador &&
              Solo muestra el precio original tachado si existe
              (PDF: Renderizado condicional - Operador &&) */}
          {precioOriginal && (
            <span className="text-xs text-gray-400 line-through">
              ${precioOriginal.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Novedades() {
  return (
    <section className="px-12 py-12 bg-[#FCF9F8]">

      {/* Encabezado de sección */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#4A0E0E]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>Novedades</h2>
          <div className="w-12 h-1 bg-[#7B5B98] mt-2" />
        </div>

        {/* COMPONENTE Link — navega sin recargar (PDF: Routing - SPA) */}
        <Link
          to="/catalogo"
          className="text-xs text-gray-500 uppercase tracking-wider hover:text-purple-600"
        >
          VER COLECCIÓN COMPLETA →
        </Link>
      </div>

      {/* RENDERIZADO DE LISTA con .map()
          Cada libro se renderiza como un componente LibroCard
          Se pasan los datos como PROPS al componente hijo
          Siempre key única para que React identifique cada elemento
          (PDF: Renderizado condicional - Listas / Estados locales y props - Props) */}
      <div className="grid grid-cols-4 gap-6">
        {libros.map((libro) => (
          <LibroCard
            key={libro.id}
            categoria={libro.categoria}
            titulo={libro.titulo}
            precio={libro.precio}
            precioOriginal={libro.precioOriginal}
            descuento={libro.descuento}
            imagen={libro.imagen}
          />
        ))}
      </div>

    </section>
  )
}

// EXPORTACIÓN del componente (PDF: Exposición de experto - Estructura de un componente)
export default Novedades