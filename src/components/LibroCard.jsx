// COMPONENTE reutilizable — se puede usar en Novedades, Catalogo, etc.
// Nombre en PascalCase, archivo propio
import { Link } from 'react-router-dom'

// PROPS — recibe los datos del libro desde el componente padre
// Son de solo lectura
function LibroCard({ id, categoria, titulo, precio, precioOriginal, descuento, imagen, tieneDetalle }) {
  return (
    <div className="flex flex-col">

      <div className="relative">

        {/* RENDERIZADO CONDICIONAL con ternario
            Si tiene detalle la imagen es clickeable, sino no  */}
        {tieneDetalle ? (
          <Link to={`/libro/${id}`}>
            <img
              src={imagen}
              alt={titulo}
              className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
            />
          </Link>
        ) : (
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-64 object-cover"
          />
        )}

        {/* RENDERIZADO CONDICIONAL con &&
            Solo muestra el badge si existe descuento  */}
        {descuento && (
          <span className="absolute top-3 right-3 bg-[#7B5B98] text-white text-xs px-2 py-1">
            {descuento}
          </span>
        )}

      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {categoria}
        </p>
        {tieneDetalle ? (
          <Link to={`/libro/${id}`}>
            <h3 className="text-sm font-medium text-[#2d2640] mb-1 hover:text-purple-700 transition">
              {titulo}
            </h3>
          </Link>
        ) : (
          <h3 className="text-sm font-medium text-[#2d2640] mb-1">
            {titulo}
          </h3>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#2d2640]">${precio}</span>
          {/* RENDERIZADO CONDICIONAL con &&
              Solo muestra precio original si existe  */}
          {descuento && precioOriginal && (
            <span className="text-xs text-gray-400 line-through">${precioOriginal}</span>
          )}
        </div>
      </div>

    </div>
  )
}

// EXPORTACIÓN del componente reutilizable
export default LibroCard