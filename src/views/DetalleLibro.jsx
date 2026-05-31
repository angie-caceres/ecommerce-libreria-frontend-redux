// VISTA — obtiene el libro y lo pasa al componente DetalleLibroCard
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { Link } from 'react-router-dom'
import DetalleLibroCard from '../components/DetalleLibroCard'

// DATOS hardcodeados — en el futuro vendrían de una API con useEffect y useParams
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

  // Por ahora mostramos el primer libro
  // Con backend usaríamos useParams para obtener el id de la URL
  // y useEffect para buscar el libro en la API
  const libro = libros[0]

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <Link to="/" className="text-sm text-gray-500 hover:text-purple-600 mb-8 inline-block">
        ← VOLVER
      </Link>

      {/* COMPONENTE hijo — recibe el libro y la función como props
          (PDF: Estados locales y props - Flujo unidireccional) */}
      <DetalleLibroCard
        libro={libro}
        agregarAlCarrito={agregarAlCarrito}
      />

    </div>
  )
}

export default DetalleLibro