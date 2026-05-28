// COMPONENTE — función JavaScript que devuelve JSX
// Cada componente es un archivo propio, nombre en PascalCase (PDF: Exposición de experto - Componentes)
import { Link, NavLink } from 'react-router-dom'

function Navbar() {

  // ARRAY de links del menú — dato estático definido dentro del componente
  // Se usa .map() para renderizar la lista (PDF: Renderizado condicional - Listas)
  const navLinks = [
    { label: 'INICIO', to: '/' },
    { label: 'CATÁLOGO', to: '/catalogo' },
    { label: 'LIBROS RECIENTES', to: '/libros-recientes' },
    { label: 'QUIÉNES SOMOS', to: '/quienes-somos' },
    { label: 'CONTACTO', to: '/contacto' },
  ]

  return (
    <header>

      {/* Barra superior púrpura */}
      <div className="bg-purple-500 text-white text-center text-sm py-2">
        ENVÍO GRATIS EN PEDIDOS SUPERIORES A $100.000
      </div>

      {/* Barra media: logo, buscador, iconos */}
      <div className="bg-white flex items-center justify-between px-8 py-4">

        {/* COMPONENTE Link de React Router — navega sin recargar la página (PDF: Routing) */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Entre Letras" className="h-12" />
        </Link>

        {/* Buscador */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/2">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="bg-transparent outline-none w-full text-sm text-gray-500"
          />
          {/* EVENTO onClick — el botón dispara una acción al hacer click (PDF: Estados locales y props) */}
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>

        {/* Iconos de usuario */}
        <div className="flex items-center gap-6 text-xs text-gray-600">

          {/* COMPONENTE Link — reemplaza la etiqueta <a> para mantener el flujo SPA (PDF: Routing) */}
          <Link to="/mis-ordenes" className="flex flex-col items-center gap-1 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            MIS ORDENES
          </Link>

          <Link to="/mi-cuenta" className="flex flex-col items-center gap-1 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            MI CUENTA
          </Link>

          <Link to="/carrito" className="flex flex-col items-center gap-1 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            MI CARRITO
          </Link>

        </div>
      </div>

      {/* Menú de navegación inferior */}
      <nav className="bg-[#2d2640] flex justify-center gap-10 py-3 text-sm">

        {/* RENDERIZADO DE LISTA con .map() — itera el array navLinks
            Siempre se usa key única para que React identifique cada elemento
            (PDF: Renderizado condicional - Renderizado de listas) */}
        {navLinks.map((item) => (

          // NavLink es igual a Link pero detecta si la ruta está activa (PDF: Routing)
          <NavLink
            key={item.to}
            to={item.to}

            // RENDERIZADO CONDICIONAL con operador ternario
            // Si isActive es true aplica estilos de activo, sino estilos normales
            // (PDF: Renderizado condicional - Operador ternario)
            className={({ isActive }) =>
              isActive
                ? 'text-white border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

    </header>
  )
}

// EXPORTACIÓN del componente para poder importarlo en App.jsx
// (PDF: Exposición de experto - Estructura de un componente)
export default Navbar