import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ResumenCompra from '../components/ResumenCompra'


function Carrito({ carrito, eliminarDelCarrito, cambiarCantidad }) {

  const navigate = useNavigate()

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <h1
        className="text-3xl font-bold text-[#4E3B67] mb-8"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >Mi Carrito</h1>

      {/* RENDERIZADO CONDICIONAL con ternario  */}
      {carrito.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
          <Link
            to="/catalogo"
            className="bg-[#2d2640] text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* COMPONENTE ResumenCompra — editable y sin envío  */}
          <ResumenCompra
            carrito={carrito}
            titulo="Mi Carrito"
            editable={true}
            mostrarEnvio={false}
            cambiarCantidad={cambiarCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
          />
          <Link
            to="/checkout"
            className="w-full bg-[#2d2640] text-white py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition mt-4 flex items-center justify-center gap-2"
            >
            Checkout →
            </Link>
        </div>
      )}

    </div>
  )
}

export default Carrito