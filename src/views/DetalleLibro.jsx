// VISTA — obtiene el libro por ID desde el backend
// (PDF: useEffect - Llamadas a APIs)
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DetalleLibroCard from '../components/DetalleLibroCard'
import { apiFetch } from '../services/api'

function DetalleLibro({ agregarAlCarrito, puedeComprar,token }) {

  const { id } = useParams()

  // HOOK useState — estado local del libro y loading

  const [libro, setLibro] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // HOOK useEffect — se ejecuta al montar el componente
  // Hace GET /libros/{id} al backend

  useEffect(() => {
    setCargando(true)
    apiFetch(`/libros/${id}`)
      .then(data => {
        setLibro({
          id: data.idLibro,
          titulo: data.titulo,
          descripcion: data.descripcion,
          precioOriginal: data.precio,
          descuento: data.porcentajeDescuento ? `-${data.porcentajeDescuento}%` : null,
          hojas: data.paginas,
          editorial: data.editorial,
          autor: data.autores?.join(', '),
          imagen: data.imagen
            ? `data:image/jpeg;base64,${data.imagen}`
            : '/libros/juegos.png',
        })
      })
      .catch(err => setError('No se pudo cargar el libro.'))
      .finally(() => setCargando(false))
  }, [id])

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <Link to="/" className="text-sm text-gray-500 hover:text-purple-600 mb-8 inline-block">
        ← VOLVER
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
          token={token}
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