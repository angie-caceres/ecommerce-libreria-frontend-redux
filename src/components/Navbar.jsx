// COMPONENTE — función JavaScript que devuelve JSX
// Cada componente es un archivo propio, nombre en PascalCase (PDF: Exposición de experto - Componentes)
import { Link, NavLink } from 'react-router-dom'

// PROPS — recibe carrito y usuario del padre App.jsx 
// Son de solo lectura, no se pueden modificar desde acá
// (PDF: Estados locales y props - ¿Qué son las props?)
function Navbar({ carrito, usuario }) {

  // ARRAY de links del menú — dato estático definido dentro del componente
  // Se usa .map() para renderizar la lista (PDF: Renderizado condicional - Listas)
  const navLinks = [
    { label: 'INICIO', to: '/' },
    { label: 'CATÁLOGO', to: '/catalogo' },
    { label: 'LIBROS RECIENTES', to: '/libros-recientes' },
    { label: 'QUIÉNES SOMOS', to: '/quienes-somos' },
    { label: 'CONTACTO', to: '/contacto' },
  ]

  // Calcula el total de items en el carrito
  // reduce() suma todas las cantidades del array
  // (PDF: Estados locales y props - Estado)
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <header>

      {/* Barra superior púrpura */}
      <div className="bg-[#7B5B98] text-white text-center text-sm py-2">
        ENVÍO GRATIS EN PEDIDOS SUPERIORES A $100.000
      </div>

      {/* Barra media: logo, buscador, iconos */}
      <div className="bg-white flex items-center justify-between px-8 h-20">

        {/* COMPONENTE Link de React Router — navega sin recargar la página (PDF: Routing) */}
        <Link to="/" className="flex items-center gap-2 h-full">
          <img src="/logo.png" alt="Entre Letras" className="h-14 w-auto object-contain" />
        </Link>

        {/* Buscador */}
        <div className="flex items-center bg-[#EBE5F2] rounded-full px-4 py-2 w-1/2">
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
        <div className="flex items-center gap-6 text-xs text-[#7B5B98]">

          {/* RENDERIZADO CONDICIONAL con ternario
              Si el usuario está logueado muestra MIS ÓRDENES y MI PERFIL
              Si no está logueado muestra solo MI CUENTA que lleva al login
              (PDF: Renderizado condicional - Operador ternario) */}
          {usuario?.rol === 'usuario' ? (
            <>
              {/* Mis Órdenes — solo visible cuando está logueado */}
              <Link to="/mis-ordenes" className="flex flex-col items-center gap-1 hover:text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 11h4M12 15h4M8 11h.01M8 15h.01" />
                </svg>
                MIS ÓRDENES
              </Link>

              {/* Mi Perfil — cuando está logueado lleva al perfil */}
              <Link to="/perfil" className="flex flex-col items-center gap-1 hover:text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                MI PERFIL
              </Link>
            </>
          ) : (
            /* Sin login — MI CUENTA lleva al login
               (PDF: Renderizado condicional - Operador ternario) */
            <Link to="/login" className="flex flex-col items-center gap-1 hover:text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              MI CUENTA
            </Link>
          )}

          {/* Carrito — siempre visible
              Si está logueado va a /carrito, sino va a /login
              (PDF: Renderizado condicional - Operador ternario) */}
          <Link
            to={usuario?.rol === 'usuario' ? '/carrito' : '/login'}
            className="flex flex-col items-center gap-1 hover:text-purple-600 relative"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Badge — solo si hay items en el carrito
                  (PDF: Renderizado condicional - Operador &&) */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            MI CARRITO
          </Link>

        </div>
      </div>

      {/* Menú de navegación inferior */}
      <nav className="bg-[#473954] flex justify-center gap-10 py-3 text-sm">

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