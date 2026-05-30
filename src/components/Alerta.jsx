// COMPONENTE reutilizable — muestra mensajes de feedback al usuario
// (PDF: Exposición de experto - Componentes reutilizables)
import { Link } from 'react-router-dom'

// PROPS — recibe texto, link opcional y función de cierre opcional
// (PDF: Estados locales y props - ¿Qué son las props?)
function Alerta({ texto, linkTexto, linkRuta, onClose }) {
  return (
    <div className="bg-purple-100 text-purple-700 px-4 py-3 rounded mt-4 flex items-center justify-between">
      
      <div className="flex items-center gap-2">
        <span>✓</span>
        <span>{texto}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra el link si se pasó linkTexto como prop
            (PDF: Renderizado condicional - Operador &&) */}
        {linkTexto && (
          <Link to={linkRuta} className="text-sm underline hover:text-purple-900">
            {linkTexto}
          </Link>
        )}

        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra la X si se pasó onClose como prop
            EVENTO onClick — llama a la función del padre para cerrar
            (PDF: Estados locales y props - Flujo unidireccional) */}
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