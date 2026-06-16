// COMPONENTE reutilizable — muestra mensajes de feedback al usuario
import { Link } from 'react-router-dom'

// PROPS — recibe texto, link opcional, función de cierre opcional, confirmación opcional e ícono opcional
function Alerta({ texto, linkTexto, linkRuta, onClose, onConfirm, confirmTexto = "Confirmar", icono = "✓" }) {
  return (
    <div className="bg-purple-100 text-purple-700 px-4 py-3 rounded mt-4 flex items-center justify-between">

      <div className="flex items-center gap-2">
        {icono && <span>{icono}</span>}
        <span>{texto}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra el link si se pasó linkTexto como prop  */}
        {linkTexto && (
          <Link to={linkRuta} className="text-sm underline hover:text-purple-900">
            {linkTexto}
          </Link>
        )}

        {/* Botón de confirmación, solo se muestra si se pasó onConfirm como prop */}
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="text-sm font-semibold bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
          >
            {confirmTexto}
          </button>
        )}

        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra la X si se pasó onClose como prop
            EVENTO onClick — llama a la función del padre para cerrar  */}
        {onClose && (
          <button onClick={onClose} className="text-purple-400 hover:text-purple-700 text-lg">
            ×
          </button>
        )}
      </div>

    </div>
  )
}

export default Alerta
