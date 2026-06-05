import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="bg-[#FCF9F8] min-h-screen flex flex-col items-center justify-center px-12">

      <p className="text-8xl font-bold text-[#2d2640] mb-4" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        404
      </p>

      <h1 className="text-2xl text-[#2d2640] mb-3" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Página no encontrada
      </h1>

      <p className="text-sm text-gray-400 mb-10 text-center max-w-sm">
        La página que buscás no existe o fue movida.
      </p>

      <Link
        to="/"
        className="bg-[#2d2640] text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
      >
        Volver al inicio
      </Link>

    </div>
  )
}

export default NotFound
