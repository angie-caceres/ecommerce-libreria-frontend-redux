import { Routes, Route, useLocation, Navigate} from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './redux/authSlice'
import { fetchCarrito } from './redux/carritoSlice'
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
  const dispatch = useDispatch()

  // useSelector — token y usuario vienen del store (persistido por redux-persist)
  const { token, usuario } = useSelector((state) => state.auth)

  // Si la ruta empieza con "/admin", esta constante va a ser true
  const esAdmin = location.pathname.startsWith("/admin") ||
    (location.pathname === "/perfil" && usuario?.rol === "admin")

  // Fetch del carrito cuando hay token — así el badge se muestra al iniciar sesión
  useEffect(() => {
    if (token) dispatch(fetchCarrito())
  }, [token, dispatch])

  const cerrarSesion = () => {
    dispatch(logout())
  }

  return (
    <>
      <ScrollArriba /> 
      {!esAdmin && <Navbar usuario={usuario} />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/libro/:id"
          element={
            <DetalleLibro
              puedeComprar={usuario?.rol === 'usuario'}
            />
          }
        />

        {/* Carrito — solo usuarios logueados */}
        <Route
          path="/carrito"
          element={
            usuario?.rol === 'usuario' ? (
              <Carrito />
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
              <Checkout />
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
        <Route path="/admin/libros" element={usuario?.rol === 'admin' ? <GestionLibros /> : <Navigate to="/login" />} />
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
          element={usuario ? <Perfil cerrarSesion={cerrarSesion} /> : <Navigate to="/login" />}
        />

        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* RENDERIZADO CONDICIONAL: Solo muestra el Footer si NO es admin */}
      {!esAdmin && <Footer />}
    </>
  )
}

export default App