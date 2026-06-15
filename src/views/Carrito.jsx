import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ResumenCompra from '../components/ResumenCompra'
import { apiFetch } from '../services/api'

function Carrito({ eliminarDelCarrito, vaciarCarrito, token }) {

  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)

  // HOOK useEffect — trae el carrito del backend al montar
  useEffect(() => {
    setCargando(true)
    apiFetch('/carrito', token)
      .then(data => {
        const itemsFormateados = data.items.map(item => ({
          id: item.idItemCarrito,
          idLibro: item.idLibro,
          titulo: item.tituloLibro,
          imagen: item.imagen
            ? `data:image/jpeg;base64,${item.imagen}`
            : null,
          precio: item.precioUnitario,
          cantidad: item.cantidad,
          subtotal: item.subtotal,
        }))
        setItems(itemsFormateados)
      })
      .catch(err => setError('No se pudo cargar el carrito.'))
      .finally(() => setCargando(false))
  }, [token])

  // EVENTO — elimina un item del carrito en el backend
  const handleEliminar = async (id) => {
    const itemToRemove = items.find(i => i.id === id)
    try {
      await apiFetch(`/carrito/items/${id}`, token, { method: 'DELETE' })
      setItems(items.filter(i => i.id !== id))
      eliminarDelCarrito(itemToRemove.idLibro)
    } catch (err) {
      setError('No se pudo eliminar el item.')
    }
  }

  // EVENTO — incrementa la cantidad
  const handleIncrementar = async (id) => {
    setAviso(null)
    try {
      const data = await apiFetch(`/carrito/items/${id}/incrementar`, token, { method: 'PUT' })
      setItems(items.map(item =>
        item.id === id
          ? { ...item, cantidad: data.cantidad, subtotal: data.subtotal }
          : item
      ))
    } catch (err) {
      setAviso(err.message || 'No se pudo actualizar el item.')
    }
  }

  // EVENTO — decrementa la cantidad
  const handleDecrementar = async (id) => {
    setAviso(null)
    try {
      const data = await apiFetch(`/carrito/items/${id}/decrementar`, token, { method: 'PUT' })
      if (!data) {
        const itemToRemove = items.find(i => i.id === id)
        setItems(items.filter(item => item.id !== id))
        eliminarDelCarrito(itemToRemove.idLibro)
      } else {
        setItems(items.map(item =>
          item.id === id
            ? { ...item, cantidad: data.cantidad, subtotal: data.subtotal }
            : item
        ))
      }
    } catch (err) {
      setError('No se pudo actualizar el item.')
    }
  }
  // EVENTO — vacía todo el carrito
    const handleVaciarCarrito = async () => {
      try {
        await apiFetch('/carrito/items', token, { method: 'DELETE' })
        setItems([])
        vaciarCarrito() // limpia el badge del Navbar
      } catch (err) {
        setError('No se pudo vaciar el carrito.')
      }
    }

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">

      <h1
        className="text-3xl font-bold text-[#4E3B67] mb-8"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Mi Carrito
      </h1>

      {cargando && (
        <p className="text-center text-gray-400 text-sm uppercase tracking-widest mt-20">
          Cargando carrito...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 text-sm uppercase tracking-widest mt-20">
          {error}
        </p>
      )}

      {!cargando && !error && (
        items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
            <Link
              to="/catalogo"
              className="bg-[#2d2640] text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {aviso && (
              <p className="text-center text-red-400 text-sm uppercase tracking-widest mb-4">
                {aviso}
              </p>
            )}
            <ResumenCompra
              carrito={items}
              titulo="Mi Carrito"
              editable={true}
              mostrarEnvio={false}
              cambiarCantidad={(id, cantidad) => {
                const item = items.find(i => i.id === id)
                if (cantidad > item?.cantidad) {
                  handleIncrementar(id)
                } else {
                  handleDecrementar(id)
                }
              }}
              eliminarDelCarrito={handleEliminar}
            />
            <button
              onClick={handleVaciarCarrito}
              className="w-full border border-red-300 text-red-400 py-3 text-sm uppercase tracking-widest hover:bg-red-50 transition mt-4"
            >
              Vaciar carrito
            </button>
            <Link
              to="/checkout"
              className="w-full bg-[#2d2640] text-white py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition mt-4 flex items-center justify-center gap-2"
            >
              Checkout →
            </Link>
          </div>
        )
      )}

    </div>
  )
}

export default Carrito