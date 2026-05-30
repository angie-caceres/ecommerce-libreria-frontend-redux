// COMPONENTE raíz — contiene el estado global del carrito
// El estado vive acá porque es el padre de todos los componentes
// que necesitan acceder al carrito (PDF: Estados locales y props - Flujo unidireccional)
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './views/Home'
import Carrito from './views/Carrito'
import DetalleLibro from './views/DetalleLibro'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Catalogo from './views/Catalogo'

function App() {

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

  return (
    <>
      {/* Navbar recibe carrito como prop para mostrar el badge
          (PDF: Estados locales y props - Flujo unidireccional) */}
      <Navbar carrito={carrito} />
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

      </Routes>
      <Footer />
    </>
  )
}

export default App