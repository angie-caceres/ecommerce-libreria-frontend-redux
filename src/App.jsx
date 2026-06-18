// COMPONENTE raíz — contiene el estado global del carrito
// El estado vive acá porque es el padre de todos los componentes
// que necesitan acceder al carrito
import { Routes, Route, useLocation, Navigate} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiFetch } from './services/api'
import Home from './views/Home'
import Carrito from './views/Carrito'
import DetalleLibro from './views/DetalleLibro'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Catalogo from './views/Catalogo'
import Checkout from './views/Checkout'
import ConfirmacionPedido from './views/ConfirmacionPedido'
import Busqueda from './views/Busqueda'
import QuienesSomos from './views/QuienesSomos'
import Contacto from './views/Contacto'
import Perfil from './views/Perfil'
import Registro from './views/Registro'
import GestionGeneros from './views/admin/GestionGeneros'
import GestionEditoriales from './views/admin/GestionEditoriales'
import GestionAutores from './views/admin/GestionAutores'
import GestionDescuentos from './views/admin/GestionDescuentos'
import GestionLibros from './views/admin/GestionLibros'
import AdminDashboard from './views/admin/AdminDashboard'
import CrearLibro from './views/admin/CrearLibro'
import EditarLibro from './views/admin/EditarLibro'
import GestionUsuario from './views/admin/GestionUsuario'
import VerPedidos from './views/admin/VerPedidos'
import GestionImagenes from './views/admin/GestionImagenes'

import Login from "./views/Login";
import MisOrdenes from "./views/MisOrdenes";
import DetalleOrden from "./views/DetalleOrden";
import NotFound from "./views/NotFound"
import ScrollArriba from "./components/ScrollArriba";




function App() {

  // se evalua en qué ruta está parado el navegador actualmente
  const location = useLocation()

  // Lee el token de localStorage al arrancar — persiste entre recargas
  const [token, setToken] = useState(localStorage.getItem('jwtToken'))

  // HOOK useState — estado global del carrito
  // Solo se usa para el badge del Navbar — el carrito real vive en el backend
  const [carrito, setCarrito] = useState([])

  // HOOK useState — estado global del usuario logueado
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario")
    return guardado ? JSON.parse(guardado) : null
  })
  // true mientras se verifica el token al arrancar — evita redirigir a /login antes de tiempo
  const [cargandoUsuario, setCargandoUsuario] = useState(!!localStorage.getItem('jwtToken'))

  // HOOK useEffect — recupera el usuario al recargar la página
  // si hay un token guardado en localStorage
useEffect(() => {
  const tokenGuardado = localStorage.getItem('jwtToken')
  if (tokenGuardado) {
    apiFetch('/usuarios/me', tokenGuardado)
      .then(data => {
        setUsuario({
          email: data.email,
          nombre: data.firstname,
          rol: data.role === 'ADMINISTRADOR' ? 'admin' : 'usuario'
        })

        // El carrito es solo para usuarios — si falla (ej: admin sin carrito),
        // no debe afectar el token ya válido
        if (data.role !== 'ADMINISTRADOR') {
          apiFetch('/carrito', tokenGuardado)
            .then(carritoData => {
              if (carritoData?.items) {
                const itemsFormateados = carritoData.items.map(item => ({
                  id: item.idLibro,
                  cantidad: item.cantidad
                }))
                setCarrito(itemsFormateados)
              }
            })
            .catch(() => {
              // si falla el carrito, no pasa nada grave — se ignora
            })
        }
      })
      .catch(() => {
        // Solo si /usuarios/me falla (token inválido o expirado) se borra el token
        localStorage.removeItem('jwtToken')
        setToken(null)
      })
      .finally(() => setCargandoUsuario(false))
  } else {
    setCargandoUsuario(false)
  }
}, [])

  // Si la ruta empieza con "/admin", esta constante va a ser true
  const esAdmin = location.pathname.startsWith("/admin") ||
    (location.pathname === "/perfil" && usuario?.rol === "admin")

  // FUNCIÓN para agregar un libro al carrito
  // Solo actualiza el badge del Navbar — el POST al backend lo hace DetalleLibroCard
  const agregarAlCarrito = (libro) => {
    const existe = carrito.find(item => item.id === libro.id)
    if (existe) {
      // Si ya existe, aumenta la cantidad
      setCarrito(carrito.map(item =>
        item.id === libro.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      // Si no existe, lo agrega con cantidad 1
      setCarrito([...carrito, { ...libro, cantidad: 1 }])
    }
  }

  // FUNCIÓN para eliminar un libro del carrito
  // Solo actualiza el badge del Navbar — el DELETE al backend lo hace Carrito.jsx
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id))
  }

  // FUNCIÓN para vaciar el carrito
  // Limpia el badge del Navbar después del checkout
  const vaciarCarrito = () => setCarrito([])

  // FUNCIÓN para cerrar sesión — limpia usuario, carrito y token
  const cerrarSesion = () => {
    localStorage.removeItem("usuario")
    localStorage.removeItem("token")
    localStorage.removeItem("jwtToken")
    setUsuario(null)
    setCarrito([])
    setToken(null)
  }
  console.log('App.jsx render - token:', token, 'usuario:', usuario, 'cargandoUsuario:', cargandoUsuario)

  return (
    <>
      <ScrollArriba /> 
      {/* Navbar recibe carrito como prop para mostrar el badge*/}
      
      {/*RENDERIZADO CONDICIONAL: Solo muestra el Navbar si NO es admin */}
      {/* Navbar recibe carrito como prop para mostrar el badge */}
      {/* RENDERIZADO CONDICIONAL: Solo muestra el Navbar si NO es admin */}
      {!esAdmin && <Navbar carrito={carrito} usuario={usuario} />}

      {!cargandoUsuario && <Routes>

        <Route path="/" element={<Home />} />

        {/* DetalleLibro recibe agregarAlCarrito y token como props */}
        <Route
          path="/libro/:id"
          element={
            <DetalleLibro
              agregarAlCarrito={agregarAlCarrito}
              puedeComprar={usuario?.rol === 'usuario'}
              token={token}
            />
          }
        />

        {/* Carrito — solo usuarios logueados */}
        <Route
          path="/carrito"
          element={
            usuario?.rol === 'usuario' ? (
              <Carrito
                eliminarDelCarrito={eliminarDelCarrito}
                vaciarCarrito={vaciarCarrito}
                token={token}
              />
            ) : <Navigate to="/login" />
          }
        />

        {/* Catálogo */}
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Búsqueda */}
        <Route path="/busqueda" element={<Busqueda />} />

        {/* Checkout — solo usuarios */}
        <Route
          path="/checkout"
          element={
            usuario?.rol === 'usuario' ? (
              <Checkout
                vaciarCarrito={vaciarCarrito}
                token={token}
              />
            ) : <Navigate to="/login" />
          }
        />

        {/* Confirmación pedido */}
        <Route path="/pedido" element={<ConfirmacionPedido />} />

        {/* Rutas admin — solo administradores */}
        <Route path="/admin/generos" element={usuario?.rol === 'admin' ? <GestionGeneros /> : <Navigate to="/login" />} />
        <Route path="/admin/editoriales" element={usuario?.rol === 'admin' ? <GestionEditoriales /> : <Navigate to="/login" />} />
        <Route path="/admin/autores" element={usuario?.rol === 'admin' ? <GestionAutores /> : <Navigate to="/login" />} />
        <Route path="/admin/descuentos" element={usuario?.rol === 'admin' ? <GestionDescuentos /> : <Navigate to="/login" />} />
        <Route path="/admin" element={usuario?.rol === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/libros" element={usuario?.rol === 'admin' ? <GestionLibros token={token} /> : <Navigate to="/login" />} />
        <Route path="/admin/libros/crear" element={usuario?.rol === 'admin' ? <CrearLibro token={token} /> : <Navigate to="/login" />} />
        <Route path="/admin/libros/editar/:id" element={usuario?.rol === 'admin' ? <EditarLibro token={token} /> : <Navigate to="/login" />} />
        <Route path="/admin/usuarios" element={usuario?.rol === 'admin' ? <GestionUsuario /> : <Navigate to="/login" />} />
        <Route path="/admin/pedidos" element={usuario?.rol === 'admin' ? <VerPedidos /> : <Navigate to="/login" />} />
        <Route path="/admin/imagenes" element={usuario?.rol === 'admin' ? <GestionImagenes /> : <Navigate to="/login" />} />

        {/* Mis órdenes — solo usuarios */}
        <Route path="/mis-ordenes" element={usuario?.rol === 'usuario' ? <MisOrdenes usuario={usuario} /> : <Navigate to="/login" />} />
        <Route path="/mis-ordenes/:id" element={<DetalleOrden />} />

        {/* Perfil — cualquier rol logueado */}
        <Route
          path="/perfil"
          element={usuario ? <Perfil usuario={usuario} cerrarSesion={cerrarSesion} /> : <Navigate to="/login" />}
        />

        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/registro" element={<Registro setUsuario={setUsuario} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login setUsuario={setUsuario} setToken={setToken} />} />
        <Route path="*" element={<NotFound />} />

      </Routes>}

      {/* RENDERIZADO CONDICIONAL: Solo muestra el Footer si NO es admin */}
      {!esAdmin && <Footer />}
    </>
  )
}

export default App