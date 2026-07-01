// VISTA — obtiene el libro por ID desde el backend a través del store de Redux
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import DetalleLibroCard from '../components/DetalleLibroCard'
import { fetchLibroById } from '../redux/librosSlice'

function DetalleLibro({ agregarAlCarrito, puedeComprar }) {

  const { id } = useParams()
  const dispatch = useDispatch()

  // useSelector — lee libroActual, loading y error del store
  const { libroActual, loading: cargando, error } = useSelector((state) => state.libros)

  // useEffect — dispara la acción asíncrona cada vez que cambia el id en la URL
  useEffect(() => {
    dispatch(fetchLibroById(id))
  }, [dispatch, id])

  // Mapeo del formato del backend al formato que espera DetalleLibroCard
  const libro = libroActual ? {
    id:             libroActual.idLibro,
    titulo:         libroActual.titulo,
    descripcion:    libroActual.descripcion,
    precioOriginal: libroActual.precio,
    descuento:      libroActual.porcentajeDescuento ? `-${libroActual.porcentajeDescuento}%` : null,
    hojas:          libroActual.paginas,
    editorial:      libroActual.editorial,
    autor:          libroActual.autores?.join(', '),
    imagen:         libroActual.imagen ? `data:image/jpeg;base64,${libroActual.imagen}` : '/libros/juegos.png',
  } : null

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <Link to="/" className="text-sm text-gray-500 hover:text-purple-600 mb-8 inline-block">
        {'← VOLVER'}
      </Link>

      {cargando && (
        <p className="text-center text-gray-400 mt-24 text-sm uppercase tracking-widest">
          Cargando...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 mt-24 text-sm uppercase tracking-widest">
          {error}
        </p>
      )}

      {!cargando && !error && libro && (
        <DetalleLibroCard
          libro={libro}
          agregarAlCarrito={agregarAlCarrito}
          puedeComprar={puedeComprar}
        />
      )}

      {!cargando && !error && !libro && (
        <p className="text-center text-gray-400 mt-24 text-sm uppercase tracking-widest">
          Libro no encontrado.
        </p>
      )}

    </div>
  )
}

export default DetalleLibro