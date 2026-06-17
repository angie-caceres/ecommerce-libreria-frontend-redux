import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:4002'

function Navbar({ carrito, usuario }) {

  const navigate = useNavigate()

  const navLinks = [
    { label: 'INICIO', to: '/' },
    { label: 'CATÁLOGO', to: '/catalogo' },
    { label: 'QUIÉNES SOMOS', to: '/quienes-somos' },
    { label: 'CONTACTO', to: '/contacto' },
  ]

  const [query, setQuery]                           = useState('')
  const [sugerencias, setSugerencias]               = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [cargando, setCargando]                     = useState(false)
  const [errorBack, setErrorBack]                   = useState(false)

  // Ref para el debounce — guarda el id del setTimeout anterior
  const debounceRef = useRef(null)

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  // EFECTO — se ejecuta cada vez que cambia query
  // Cancela el fetch anterior y lanza uno nuevo tras 400ms sin escribir
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length === 0) {
      setSugerencias([])
      setMostrarSugerencias(false)
      setErrorBack(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setCargando(true)
      setErrorBack(false)
      try {
        const res = await fetch(`${BASE_URL}/libros`)
        if (!res.ok) throw new Error('Error del servidor')
        const data = await res.json()

        // Filtramos en el front por título o autor
        const q = query.toLowerCase()
        const filtrados = data.filter(libro =>
          libro.titulo?.toLowerCase().includes(q) ||
          libro.autores?.some(a => a.toLowerCase().includes(q))
        )
        setSugerencias(filtrados.slice(0, 6)) // máximo 6 sugerencias
        setMostrarSugerencias(true)
      } catch (e) {
        // Si el back no está corriendo, lo manejamos sin romper nada
        setErrorBack(true)
        setSugerencias([])
        setMostrarSugerencias(true)
      } finally {
        setCargando(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const seleccionarSugerencia = (libro) => {
    setQuery('')
    setSugerencias([])
    setMostrarSugerencias(false)
    navigate(`/libro/${libro.idLibro}`)
  }

  const handleBuscar = () => {
    if (query.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMostrarSugerencias(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBuscar()
  }

  return (
    <header>

      {/* Barra superior púrpura */}
      <div className="bg-[#7B5B98] text-white text-center text-sm py-2">
        ENVÍO GRATIS EN PEDIDOS SUPERIORES A $100.000
      </div>

      {/* Barra media: logo, buscador, iconos */}
      <div className="bg-white flex items-center justify-between px-8 h-20">

        <Link to="/" className="flex items-center gap-2 h-full">
          <img src="/logo.png" alt="Entre Letras" className="h-14 w-auto object-contain" />
        </Link>

        {/* Buscador con sugerencias */}
        <div className="relative w-1/2">
          <div className="flex items-center bg-[#EBE5F2] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => query.trim().length > 0 && setMostrarSugerencias(true)}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none w-full text-sm text-gray-500"
            />
            <button onClick={handleBuscar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>

          {/* Dropdown de sugerencias */}
          {mostrarSugerencias && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

              {/* Cargando */}
              {cargando && (
                <p className="text-sm text-gray-400 px-4 py-3">Buscando...</p>
              )}

              {/* Error de conexión */}
              {!cargando && errorBack && (
                <p className="text-sm text-gray-400 px-4 py-3">
                  No se pudo conectar con el servidor.
                </p>
              )}

              {/* Sin resultados */}
              {!cargando && !errorBack && sugerencias.length === 0 && (
                <p className="text-sm text-gray-400 px-4 py-3">
                  No se encontraron resultados.
                </p>
              )}

              {/* Lista de sugerencias */}
              {!cargando && !errorBack && sugerencias.length > 0 && (
                <ul className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {sugerencias.map(libro => (
                    <li
                      key={libro.idLibro}
                      onClick={() => seleccionarSugerencia(libro)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer"
                    >
                      {/* Imagen — base64 si existe, placeholder si no */}
                      {libro.imagen ? (
                        <img
                          src={`data:image/jpeg;base64,${libro.imagen}`}
                          alt={libro.titulo}
                          className="h-10 w-7 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-7 bg-purple-100 rounded flex items-center justify-center text-purple-300 text-xs">
                          📖
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{libro.titulo}</p>
                        <p className="text-xs text-gray-400">
                          {libro.autores?.join(', ')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          )}
        </div>

        {/* Iconos de usuario */}
        <div className="flex items-center gap-6 text-xs text-[#7B5B98]">

          {usuario?.rol === 'usuario' ? (
            <>
              <Link to="/mis-ordenes" className="flex flex-col items-center gap-1 hover:text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 11h4M12 15h4M8 11h.01M8 15h.01" />
                </svg>
                MIS ÓRDENES
              </Link>

              <Link to="/perfil" className="flex flex-col items-center gap-1 hover:text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                MI PERFIL
              </Link>
            </>
          ) : (
            <Link to="/login" className="flex flex-col items-center gap-1 hover:text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              MI CUENTA
            </Link>
          )}

          <Link
            to={usuario?.rol === 'usuario' ? '/carrito' : '/login'}
            className="flex flex-col items-center gap-1 hover:text-purple-600 relative"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
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
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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

export default Navbar