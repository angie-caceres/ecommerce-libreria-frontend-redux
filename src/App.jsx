// COMPONENTE raíz — contiene el estado global del carrito
// El estado vive acá porque es el padre de todos los componentes
// que necesitan acceder al carrito (PDF: Estados locales y props - Flujo unidireccional)
import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Home from './views/Home'
import Carrito from './views/Carrito'
import DetalleLibro from './views/DetalleLibro'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Catalogo from './views/Catalogo'
import Checkout from './views/Checkout'
import ConfirmacionPedido from './views/ConfirmacionPedido'

import GestionGeneros from './views/admin/GestionGeneros'
import GestionEditoriales from './views/admin/GestionEditoriales'
import GestionAutores from './views/admin/GestionAutores'
import GestionDescuentos from './views/admin/GestionDescuentos'
import HeaderAdmin from './components/HeaderAdmin'
import Sidebar from './components/Sidebar'
import Pagination from './components/Pagination'

function App() {

  // Evaluamos en qué ruta está parado el navegador actualmente
  const location = useLocation();

  // Si la ruta empieza con "/admin", esta constante va a ser true
  const esAdmin = location.pathname.startsWith("/admin");
  
  // HOOK useState — estado global del carrito
  // Array de objetos, cada uno representa un libro agregado
  // (PDF: Estados locales y props - useState)
  const [carrito, setCarrito] = useState([])


  // FUNCIÓN para agregar un libro al carrito
  // Se pasa como PROP a DetalleLibro (PDF: Estados locales y props - Props)
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
  // Se pasa como PROP a Carrito (PDF: Estados locales y props - Props)
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

  return (
    <>

      {/* Navbar recibe carrito como prop para mostrar el badge
          (PDF: Estados locales y props - Flujo unidireccional) */}
      
      {/*RENDERIZADO CONDICIONAL: Solo muestra el Navbar si NO es admin */}
      {!esAdmin && <Navbar carrito={carrito} />}

      <Routes>

        <Route path="/" element={<Home />} />

        {/* DetalleLibro recibe agregarAlCarrito como prop */}
        <Route
          path="/libro/:id"
          element={
            <DetalleLibro
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />

        {/* Carrito recibe todo lo necesario como props */}
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              cambiarCantidad={cambiarCantidad}
            />
          }
        />

        {/* Catálogo */}
        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} />}
        />

        {/* Confirmacion pedido */}
        <Route 
          path="/pedido" 
          element={<ConfirmacionPedido/>} 
        />

        <Route path="/admin/generos" element={<GestionGeneros />} />
        <Route path="/admin/editoriales" element={<GestionEditoriales />} />
        <Route path="/admin/autores" element={<GestionAutores />} />
        <Route path="/admin/descuentos" element={<GestionDescuentos />} />

      </Routes>
      {/* RENDERIZADO CONDICIONAL: Solo muestra el Footer si NO es admin */}
      {!esAdmin && <Footer />}
    </>
  )
}

export default App