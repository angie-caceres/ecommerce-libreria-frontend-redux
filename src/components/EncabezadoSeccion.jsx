// COMPONENTE reutilizable — título y botón de acción
// Se usa en todas las vistas de gestión admin
import { Plus } from 'lucide-react'

// PROPS — recibe titulo, textBoton y onAccion del padre
function EncabezadoSeccion({ titulo, textBoton, onAccion }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2
        className="text-4xl text-gray-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {titulo}
      </h2>

      {/* RENDERIZADO CONDICIONAL con &&
          Solo muestra el botón si se pasó textBoton como prop  */}
      {textBoton && (
        <button
          onClick={onAccion}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity bg-[#CBAAE9] shadow-sm uppercase tracking-wider"
        >
          <Plus size={14} />
          {textBoton}
        </button>
      )}
    </div>
  )
}

export default EncabezadoSeccion