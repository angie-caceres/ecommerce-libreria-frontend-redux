import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLibros } from '../redux/librosSlice'
import LibroCard from '../components/LibroCard'
import { calcularPrecioFinal } from '../utils/calcularPrecio'

function Busqueda() {
  const dispatch = useDispatch()
  const { items, loading: cargando, error, status } = useSelector((state) => state.libros)

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (status === 'idle') dispatch(fetchLibros())
  }, [dispatch, status])

  const q = query.toLowerCase()
  const resultados = items.filter(libro =>
    libro.titulo?.toLowerCase().includes(q) ||
    libro.autores?.some(a => a.toLowerCase().includes(q))
  )

  const mapearLibro = (libro) => {
    const descuento = libro.porcentajeDescuento ? `-${libro.porcentajeDescuento}%` : null
    return {
      id:             libro.idLibro,
      titulo:         libro.titulo,
      precioOriginal: libro.precio,
      precio:         calcularPrecioFinal(libro.precio, descuento),
      descuento,
      imagen:         libro.imagen ? `data:image/jpeg;base64,${libro.imagen}` : null,
      tieneDetalle:   true,
    }
  }

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-12">

      <h1
        className="text-3xl text-[#2d2640] mb-2"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Resultados para "{query}"
      </h1>

      {/* Estado de carga */}
      {cargando && (
        <p className="text-sm text-gray-400 mb-10">Buscando...</p>
      )}

      {/* Error de conexión */}
      {error && (
        <p className="text-sm text-red-400 mb-10">No se pudo conectar con el servidor.</p>
      )}

      {/* Resultados */}
      {!cargando && !error && (
        <>
          <p className="text-sm text-gray-400 mb-10">
            {resultados.length > 0
              ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`
              : 'No se encontraron resultados'
            }
          </p>

          {resultados.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {resultados.map(libro => (
                <LibroCard
                  key={libro.idLibro}
                  {...mapearLibro(libro)}
                />
              ))}
            </div>
          )}

          {resultados.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No encontramos libros para "{query}"</p>
              <p className="text-gray-300 text-sm">Intentá con otro título o autor</p>
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default Busqueda
