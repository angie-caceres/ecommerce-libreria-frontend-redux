// COMPONENTE reutilizable — botones de filtro
// Se usa en Usuarios y Pedidos
// (PDF: Exposición de experto - Componentes reutilizables)

// PROPS — recibe opciones, activo y onChange del padre
// (PDF: Estados locales y props - ¿Qué son las props?)
function FiltrosBotones({ opciones, activo, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* RENDERIZADO DE LISTA con .map()
          (PDF: Renderizado condicional - Listas) */}
      {opciones.map(opcion => (
        <button
          key={opcion}
          onClick={() => onChange(opcion)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            activo === opcion
              ? 'bg-[#CBAAE9] text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {opcion}
        </button>
      ))}
    </div>
  )
}

export default FiltrosBotones