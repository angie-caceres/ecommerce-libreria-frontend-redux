// COMPONENTE — muestra las novedades del home
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LibroCard from './LibroCard'
import { fetchLibros } from '../redux/librosSlice'

function Novedades() {

  const dispatch = useDispatch()

  // useSelector — lee todos los libros del store global
  const { items, loading, error, status } = useSelector((state) => state.libros)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchLibros())
  }, [dispatch, status])

  // Toma los primeros 4 para mostrar como novedades
  const novedades = items.slice(0, 4).map(libro => ({
    id:             libro.idLibro,
    titulo:         libro.titulo,
    categoria:      libro.genero,
    precio:         libro.precio,
    precioOriginal: libro.precio,
    descuento:      libro.porcentajeDescuento ? `-${libro.porcentajeDescuento}%` : null,
    imagen:         libro.imagen ? `data:image/jpeg;base64,${libro.imagen}` : '/libros/juegos.png',
    tieneDetalle:   true,
  }))

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

      {/* RENDERIZADO DE LISTA con .map() */}
      {loading && <p className="text-gray-400 text-sm">Cargando novedades...</p>}
      {error   && <p className="text-gray-400 text-sm">No se pudieron cargar las novedades.</p>}

      {!loading && !error && (
        <div className="grid grid-cols-4 gap-6">
          {novedades.map((libro) => (
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
      )}

    </div>
  )
}

export default Novedades