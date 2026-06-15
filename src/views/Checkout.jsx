// VISTA — página de checkout
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ResumenCompra from '../components/ResumenCompra'
import { apiFetch } from '../services/api'

function Checkout({ vaciarCarrito, token }) {

  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [errorPago, setErrorPago] = useState('')
  const navigate = useNavigate()

  const [editandoDireccion, setEditandoDireccion] = useState(false)
  const [direccion, setDireccion] = useState({
    calle: 'Av. del Libertador 1450, Piso 4B',
    codigoPostal: 'C1425',
    ciudad: 'Buenos Aires, Argentina',
  })
  const [direccionTemp, setDireccionTemp] = useState(direccion)

  const [tarjeta, setTarjeta] = useState({
    nombre: '', numero: '', vencimiento: '', cvv: '',
  })

  // HOOK useEffect — trae el carrito del backend al montar
  useEffect(() => {
    apiFetch('/carrito', token)
      .then(data => {
        const itemsFormateados = data.items.map(item => ({
          id: item.idItemCarrito,
          idLibro: item.idLibro,
          titulo: item.tituloLibro,
          imagen: item.imagen ? `data:image/jpeg;base64,${item.imagen}` : null,
          precio: item.precioUnitario,
          cantidad: item.cantidad,
          subtotal: item.subtotal,
        }))
        setItems(itemsFormateados)
      })
      .catch(err => console.error('Error cargando carrito:', err))
      .finally(() => setCargando(false))
  }, [token])

  const handleGuardarDireccion = () => { setDireccion(direccionTemp); setEditandoDireccion(false) }
  const handleCancelarDireccion = () => { setDireccionTemp(direccion); setEditandoDireccion(false) }

  const handleNumeroTarjeta = (e) => {
    setErrorPago('')
    const solo = e.target.value.replace(/\D/g, '').slice(0, 16)
    setTarjeta({ ...tarjeta, numero: solo.replace(/(.{4})/g, '$1 ').trim() })
  }

  const handleVencimiento = (e) => {
    setErrorPago('')
    const solo = e.target.value.replace(/\D/g, '').slice(0, 4)
    setTarjeta({ ...tarjeta, vencimiento: solo.length > 2 ? solo.slice(0, 2) + ' / ' + solo.slice(2) : solo })
  }

  const handleCVV = (e) => {
    setErrorPago('')
    setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })
  }

  const handleNombre = (e) => {
    setErrorPago('')
    setTarjeta({ ...tarjeta, nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '') })
  }

  // EVENTO — confirma la compra llamando al backend
  const handleConfirmarCompra = async () => {
    const numeroSinEspacios = tarjeta.numero.replace(/\s/g, '')

    if (
      !tarjeta.nombre.trim() ||
      numeroSinEspacios.length !== 16 ||
      tarjeta.vencimiento.length !== 7 ||
      tarjeta.cvv.length !== 3
    ) {
      setErrorPago('Completá correctamente todos los datos de la tarjeta.')
      return
    }

    setErrorPago('')

    try {
      // POST /carrito/checkout — crea la orden en el backend
      const orden = await apiFetch('/carrito/checkout', token, {
        method: 'POST',
        body: JSON.stringify({
          metodoPago: metodoPago === 'tarjeta' ? 'TARJETA_CREDITO' : 'MERCADO_PAGO'
        })
      })

      // Limpia el badge del Navbar
      vaciarCarrito()

      // Navega a confirmación con los datos de la orden
   
      navigate('/pedido', { state: { orden,items } })

    } catch (err) {
      setErrorPago(err.message || 'No se pudo confirmar la compra.')
    }
  }

  if (cargando) {
    return (
      <div className="bg-[#FCF9F8] min-h-screen px-12 py-12">
        <p className="text-center text-gray-400 text-sm uppercase tracking-widest mt-20">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-12">

      <h1 className="text-3xl font-bold text-[#4E3B67] mb-16" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Checkout
      </h1>

      <div className="max-w-7xl mx-auto flex gap-10">

        <div className="flex-1">

          <h2 className="text-xl text-[#2d2640] mb-6" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
            Método de Pago
          </h2>

          <div className="border-t border-gray-200 mb-6"></div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => setMetodoPago('tarjeta')}
              className={metodoPago === 'tarjeta' ? 'border-2 border-[#7B5B98] bg-[#F1E9F6] p-6 text-left' : 'border border-gray-300 bg-white p-6 text-left'}
            >
              <p className="font-semibold uppercase text-sm">Tarjeta de Crédito</p>
              <p className="text-sm text-gray-500 mt-2">Visa, Mastercard, Amex</p>
            </button>

            <button
              onClick={() => setMetodoPago('mercadopago')}
              className={metodoPago === 'mercadopago' ? 'border-2 border-[#7B5B98] bg-[#F1E9F6] p-6 text-left' : 'border border-gray-300 bg-white p-6 text-left'}
            >
              <p className="font-semibold uppercase text-sm">Mercado Pago</p>
              <p className="text-sm text-gray-500 mt-2">Dinero en cuenta o cuotas</p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">Nombre en la tarjeta</label>
              <input type="text" value={tarjeta.nombre} onChange={handleNombre} placeholder="JUAN PÉREZ" className="w-full border border-gray-300 p-3 mt-2 bg-white" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">Número de tarjeta</label>
              <input type="text" value={tarjeta.numero} onChange={handleNumeroTarjeta} placeholder="**** **** **** ****" className="w-full border border-gray-300 p-3 mt-2 bg-white" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">Vencimiento</label>
              <input type="text" value={tarjeta.vencimiento} onChange={handleVencimiento} placeholder="MM / AA" className="w-full border border-gray-300 p-3 mt-2 bg-white" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500">CVV</label>
              <input type="text" value={tarjeta.cvv} onChange={handleCVV} placeholder="000" className="w-full border border-gray-300 p-3 mt-2 bg-white" />
            </div>
          </div>

          {errorPago && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 mb-6 rounded">
              {errorPago}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-[#2d2640]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>Envío</h2>
              {!editandoDireccion && (
                <button onClick={() => setEditandoDireccion(true)} className="border border-gray-400 px-3 py-1 text-xs uppercase hover:bg-gray-100 transition">Editar</button>
              )}
            </div>

            {!editandoDireccion ? (
              <div className="bg-white border border-gray-200 p-6">
                <p className="text-gray-700">{direccion.calle}</p>
                <p className="text-gray-500">{direccion.codigoPostal} {direccion.ciudad}</p>
                <p className="text-sm text-gray-400 mt-4">Entrega estimada: 3 a 5 días hábiles.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#7B5B98] p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Calle y número</label>
                    <input type="text" value={direccionTemp.calle} onChange={e => setDireccionTemp({ ...direccionTemp, calle: e.target.value })} className="w-full border border-gray-300 p-3 mt-2 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-500">Código postal</label>
                    <input type="text" value={direccionTemp.codigoPostal} onChange={e => setDireccionTemp({ ...direccionTemp, codigoPostal: e.target.value.slice(0, 8) })} className="w-full border border-gray-300 p-3 mt-2 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-500">Ciudad</label>
                    <input type="text" value={direccionTemp.ciudad} onChange={e => setDireccionTemp({ ...direccionTemp, ciudad: e.target.value })} className="w-full border border-gray-300 p-3 mt-2 bg-white" />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={handleGuardarDireccion} className="bg-[#4E3B67] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#7B5B98] transition">Guardar</button>
                  <button onClick={handleCancelarDireccion} className="border border-gray-300 px-6 py-2 text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="w-[380px]">
          <ResumenCompra
            carrito={items}
            titulo="Resumen de Compra"
            editable={false}
            mostrarEnvio={true}
            mostrarBoton={true}
            onConfirmar={handleConfirmarCompra}
          />
        </div>

      </div>
    </div>
  )
}

export default Checkout