// VISTA — pantalla de confirmación luego del checkout
// Muestra el resumen de compra con el banner de confirmado
// y el componente Quote al pie

import { useLocation } from 'react-router-dom'
import ResumenCompra from '../components/ResumenCompra'
import Quote from '../components/Quote'

function ConfirmacionPedido({}) {

  const { state } = useLocation()
   
  const carrito = state?.items ?? []

  return (
    <div className="bg-[#FCF9F8] min-h-screen">

      <div className="px-12 py-12 max-w-4xl mx-auto">

        <h1
          className="text-5xl text-center text-[#4E3B67] mb-12"
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          Resumen de compra
        </h1>

        {/* Resumen con banner confirmado y sin botón */}
        <ResumenCompra
          carrito={carrito}
          titulo="Resumen de Compra"
          editable={false}
          mostrarEnvio={true}
          mostrarBoton={false}
          confirmado={true}
        />

      </div>

      {/* Separador con ícono libro */}
      <div className="flex items-center gap-4 px-12 my-8 max-w-4xl mx-auto">
        <div className="flex-1 border-t border-gray-200"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Cita literaria */}
      <Quote />

    </div>
  )
}

export default ConfirmacionPedido