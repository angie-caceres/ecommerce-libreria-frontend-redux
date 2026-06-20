// COMPONENTE reutilizable — modal de crear/editar
// Se usa en Géneros, Editoriales, Autores y Descuentos
import { X } from 'lucide-react'

// PROPS — recibe titulo, children y funciones del padre
// children permite pasar cualquier contenido dentro del modal
function ModalFormulario({ titulo, onCerrar, onAceptar, deshabilitado = false, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={onCerrar} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

        <div className="flex items-center justify-between mb-5">
          <span className="font-semibold text-gray-800">{titulo}</span>
          {/* EVENTO onClick — cierra el modal  */}
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        {/* children — contenido flexible del formulario
            Cada vista pasa sus propios campos como children  */}
        <div className="space-y-4">
          {children}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCerrar}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wider"
            >
              CANCELAR
            </button>
            {/* EVENTO onClick — llama a la función del padre  */}
            <button
              onClick={onAceptar}
              disabled={deshabilitado}
              className="px-5 py-2 rounded-lg text-white text-xs font-semibold uppercase hover:opacity-90 disabled:opacity-40 transition-opacity bg-[#2d2660]"
            >
              ACEPTAR
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ModalFormulario