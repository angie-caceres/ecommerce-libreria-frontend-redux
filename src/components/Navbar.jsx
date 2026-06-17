// COMPONENTE — función JavaScript que devuelve JSX
// Cada componente es un archivo propio, nombre en PascalCase

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { libros } from '../data/libros'

// PROPS — recibe carrito y usuario del padre App.jsx 
// Son de solo lectura, no se pueden modificar desde acá
function Navbar({ carrito, usuario }) {

    const navigate = useNavigate()

  // ARRAY de links del menú — dato estático definido dentro del componente
  // Se usa .map() para renderizar la lista 
  const navLinks = [
    { label: 'INICIO', to: '/' },
    { label: 'CATÁLOGO', to: '/catalogo' },
    { label: 'QUIÉNES SOMOS', to: '/quienes-somos' },
    { label: 'CONTACTO', to: '/contacto' },
  ]
  // HOOK useState — estado local del buscador

  const [query, setQuery]                         = useState('')
  const [sugerencias, setSugerencias]             = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  // Calcula el total de items en el carrito
  // reduce() suma todas las cantidades del array

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
// EVENTO — filtra libros mientras el usuario escribe
  const handleQueryChange = (val) => {
    setQuery(val)
    if (val.trim().length > 0) {
      const filtrados = libros.filter(libro =>
        libro.titulo.toLowerCase().includes(val.toLowerCase()) ||
        libro.autor.toLowerCase().includes(val.toLowerCase())
      )
      setSugerencias(filtrados)
      setMostrarSugerencias(true)
    } else {
      setSugerencias([])
      setMostrarSugerencias(false)
    }
  }

  // EVENTO — navega al detalle del libro seleccionado
  const seleccionarSugerencia = (libro) => {
    setQuery('')
    setSugerencias([])
    setMostrarSugerencias(false)
    navigate(`/libro/${libro.id}`)
  }

  // EVENTO — navega a la página de búsqueda al hacer click en la lupa
  const handleBuscar = () => {
    if (query.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMostrarSugerencias(false)
    }
  }

  return (
    <header>

      {/* Barra superior púrpura */}
      <div className="bg-[#7B5B98] text-white text-center text-sm py-2">
        HASTA TRES CUOTAS SIN INTERÉS
      </div>

      {/* Barra media: logo, buscador, iconos */}
      <div className="bg-white flex items-center justify-between px-8 h-20">

        {/* COMPONENTE Link de React Router — navega sin recargar la página */}
        <Link to="/" className="flex items-center gap-2 h-full">
          <img src="/logo.png" alt="Entre Letras" className="h-14 w-auto object-contain" />
        </Link>

        {/* Buscador con sugerencias - Se puede buscar por nombre de libro y autor*/}
        <div className="relative w-1/2">
          <div className="flex items-center bg-[#EBE5F2] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => query.trim().length > 0 && setMostrarSugerencias(true)}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              className="bg-transparent outline-none w-full text-sm text-gray-500"
            />
            {/* EVENTO onClick — busca al hacer click en la lupa */}
            <button onClick={handleBuscar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>

          {/* RENDERIZADO CONDICIONAL con &&
              Solo muestra sugerencias si hay resultados */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto divide-y divide-gray-50">
              {/* RENDERIZADO DE LISTA con .map()*/}
              {sugerencias.map(libro => (
                <li
                  key={libro.id}
                  onClick={() => seleccionarSugerencia(libro)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer"
                >
                  <img src={libro.imagen} alt={libro.titulo} className="h-10 w-7 object-cover rounded" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{libro.titulo}</p>
                    <p className="text-xs text-gray-400">{libro.autor}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* RENDERIZADO CONDICIONAL con &&
              Muestra mensaje si no hay resultados */}
          {mostrarSugerencias && sugerencias.length === 0 && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
              <p className="text-sm text-gray-400">No se encontraron resultados.</p>
            </div>
          )}
        </div>

        {/* Iconos de usuario */}
        <div className="flex items-center gap-6 text-xs text-[#7B5B98]">

          {/* RENDERIZADO CONDICIONAL con ternario
              Si el usuario está logueado muestra MIS ÓRDENES y MI PERFIL
              Si no está logueado muestra solo MI CUENTA que lleva al login
  */}
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
  */
            <Link to="/login" className="flex flex-col items-center gap-1 hover:text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              MI CUENTA
            </Link>
          )}

          {/* Carrito — siempre visible
              Si está logueado va a /carrito, sino va a /login
  */}
          <Link
            to={usuario?.rol === 'usuario' ? '/carrito' : '/login'}
            className="flex flex-col items-center gap-1 hover:text-purple-600 relative"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Badge — solo si hay items en el carrito
  */}
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
  */}
        {navLinks.map((item) => (

          // NavLink es igual a Link pero detecta si la ruta está activa
          <NavLink
            key={item.to}
            to={item.to}

            // RENDERIZADO CONDICIONAL con operador ternario
            // Si isActive es true aplica estilos de activo, sino estilos normales
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
export default Navbar