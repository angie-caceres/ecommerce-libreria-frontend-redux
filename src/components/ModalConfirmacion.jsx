// COMPONENTE reutilizable — modal de confirmación de borrado
// Se usa en todas las vistas de gestión admin

// PROPS — recibe titulo, mensaje y funciones del padre
function ModalConfirmacion({ titulo, mensaje, onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={onCancelar} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-800">{titulo}</span>
          {/* EVENTO onClick — cierra el modal  */}
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <p className="text-sm text-gray-600 mb-5">{mensaje}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wider"
          >
            CANCELAR
          </button>
          {/* EVENTO onClick — confirma la acción del padre  */}
          <button
            onClick={onConfirmar}
            className="px-5 py-2 rounded-lg text-white text-xs font-semibold uppercase bg-red-500 hover:bg-red-600 transition-colors"
          >
            ELIMINAR
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalConfirmacion