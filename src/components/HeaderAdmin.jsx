import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="h-16 bg-[#f7f4ef] border-b border-gray-200 px-10 flex items-center relative">

      {/* Título centrado */}
      <h1 className="text-[#7b5b99] text-lg absolute left-1/2 -translate-x-1/2" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        ¡Bienvenido Administrador!
      </h1>

      {/* Perfil — a la derecha */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Link a Mi Perfil — navega sin recargar la página
            (PDF: Routing) */}
        <Link
          to="/perfil"
          className="w-9 h-9 rounded-full bg-purple-200 border border-purple-300 flex items-center justify-center text-purple-700 text-xs font-bold hover:bg-purple-300 transition"
        >
          AD
        </Link>
      </div>

    </header>
  )
}

export default Header