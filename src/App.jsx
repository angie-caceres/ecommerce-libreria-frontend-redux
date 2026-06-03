// COMPONENTE raíz — contiene el estado global del carrito
// El estado vive acá porque es el padre de todos los componentes
// que necesitan acceder al carrito 
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
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
import HeaderAdmin from './components/HeaderAdmin'
import Sidebar from './components/Sidebar'
import Pagination from './components/Pagination'
import AdminDashboard from './views/admin/AdminDashboard'
import CrearLibro from './views/admin/CrearLibro'
import EditarLibro from './views/admin/EditarLibro'
import GestionUsuario from './views/admin/GestionUsuario'
import VerPedidos from './views/admin/VerPedidos'
import GestionImagenes from './views/admin/GestionImagenes'

import Login from "./views/Login";
import MisOrdenes from "./views/MisOrdenes";
import DetalleOrden from "./views/DetalleOrden";




function App() {

  // se evalua en qué ruta está parado el navegador actualmente
  const location = useLocation();


  
  // HOOK useState — estado global del carrito
  // Array de objetos, cada uno representa un libro agregado

  const [carrito, setCarrito] = useState([])
  const [usuario, setUsuario] = useState(null)

  // Si la ruta empieza con "/admin", esta constante va a ser true
  const esAdmin = location.pathname.startsWith("/admin") || 
                (location.pathname === "/perfil" && usuario?.rol === "admin")

                
  // FUNCIÓN para agregar un libro al carrito
  // Se pasa como PROP a DetalleLibro 
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
  // Se pasa como PROP a Carrito 
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id))
  }

  // FUNCIÓN para cambiar cantidad
  const cambiarCantidad = (id, cantidad) => {
    if (cantidad === 0) {
      eliminarDelCarrito(id)
    } else {
      setCarrito(carrito.map(item =>
        item.id === id ? { ...item, cantidad } : item
      ))
    }
  }

  // FUNCIÓN para vaciar el carrito al confirmar la compra
  const vaciarCarrito = () => setCarrito([])
  const cerrarSesion = () => {
  setUsuario(null)
  setCarrito([])}

  return (
    <>

      {/* Navbar recibe carrito como prop para mostrar el badge*/}
      
      {/*RENDERIZADO CONDICIONAL: Solo muestra el Navbar si NO es admin */}
      {!esAdmin && <Navbar carrito={carrito} usuario={usuario} />}

      <Routes>

        <Route path="/" element={<Home />} />

        {/* DetalleLibro recibe agregarAlCarrito como prop */}
        <Route
          path="/libro/:id"
          element={
            <DetalleLibro
              agregarAlCarrito={agregarAlCarrito}
              puedeComprar={usuario?.rol === 'usuario'}
            />
          }
        />

        {/* Carrito — solo usuarios */}
        <Route
          path="/carrito"
          element={
            usuario?.rol === 'usuario' ? (
              <Carrito
                carrito={carrito}
                eliminarDelCarrito={eliminarDelCarrito}
                cambiarCantidad={cambiarCantidad}
              />
            ) : <Navigate to="/login" />
          }
        />

        {/* Catálogo */}
        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        {/* Búsqueda */}
        <Route path="/busqueda" element={<Busqueda />} />

        {/* Checkout — solo usuarios */}
        <Route
          path="/checkout"
          element={
            usuario?.rol === 'usuario' ? (
              <Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} />
            ) : <Navigate to="/login" />
          }
        />

        {/* <Route path="/gestion-libros" element={<GestionLibros />} /> */}

        {/* Confirmacion pedido */}
        <Route 
          path="/pedido" 
          element={<ConfirmacionPedido/>} 
        />
        <Route path="/admin/generos" element={usuario?.rol === 'admin' ? <GestionGeneros /> : <Navigate to="/login" />} />
        <Route path="/admin/editoriales" element={usuario?.rol === 'admin' ? <GestionEditoriales /> : <Navigate to="/login" />} />
        <Route path="/admin/autores" element={usuario?.rol === 'admin' ? <GestionAutores /> : <Navigate to="/login" />} />
        <Route path="/admin/descuentos" element={usuario?.rol === 'admin' ? <GestionDescuentos /> : <Navigate to="/login" />} />
        <Route path="/admin" element={usuario?.rol === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/libros" element={usuario?.rol === 'admin' ? <GestionLibros /> : <Navigate to="/login" />} />
        <Route path="/admin/libros/crear" element={usuario?.rol === 'admin' ? <CrearLibro /> : <Navigate to="/login" />} />
        <Route path="/admin/libros/editar/:id" element={usuario?.rol === 'admin' ? <EditarLibro /> : <Navigate to="/login" />} />
        <Route path="/admin/usuarios" element={usuario?.rol === 'admin' ? <GestionUsuario /> : <Navigate to="/login" />} />
        <Route path="/admin/pedidos" element={usuario?.rol === 'admin' ? <VerPedidos /> : <Navigate to="/login" />} />
        <Route path="/admin/imagenes" element={usuario?.rol === 'admin'? <GestionImagenes /> : <Navigate to="/login" />}/>
        <Route path="/mis-ordenes" element={usuario?.rol === 'usuario'? <MisOrdenes usuario={usuario} /> : <Navigate to="/login" />}/>
        <Route path="/mis-ordenes/:id" element={<DetalleOrden />} />
        <Route
        path="/perfil"
        element={
          usuario ? <Perfil usuario={usuario} cerrarSesion={cerrarSesion} /> : <Navigate to="/login" />
        }
        />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/registro" element={<Registro setUsuario={setUsuario} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login setUsuario={setUsuario} />}/>
      </Routes>
      {/* RENDERIZADO CONDICIONAL: Solo muestra el Footer si NO es admin */}
      {!esAdmin && <Footer />}
    </>
  )
}

export default App