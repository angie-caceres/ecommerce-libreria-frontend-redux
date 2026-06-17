// VISTA — página que muestra todos los libros disponibles
// Los libros se obtienen del backend al montar el componente

import { useState, useEffect } from 'react'
import LibroCard from '../components/LibroCard'

const BASE_URL = 'http://localhost:4002'

function Catalogo() {

  // HOOK useState — lista de libros que viene del back
  const [libros, setLibros]     = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState(false)

  // HOOK useState — filtros
  const [precioMax, setPrecioMax]                         = useState(0)
  const [precioMaximo, setPrecioMaximo]                   = useState(0)
  const [autorSeleccionado, setAutorSeleccionado]         = useState('')
  const [editorialSeleccionada, setEditorialSeleccionada] = useState('')
  const [generosSeleccionados, setGenerosSeleccionados]   = useState([])

  // HOOK useEffect — trae los libros del back al montar
  useEffect(() => {
    const fetchLibros = async () => {
      setCargando(true)
      setError(false)
      try {
        const res = await fetch(`${BASE_URL}/libros`)
        if (!res.ok) throw new Error('Error del servidor')
        const data = await res.json()
        setLibros(data)

        // Precio máximo = precio más alto del catálogo real
        // Se usa para el tope del slider y para que arranque mostrando todo
        const maxPrecio = Math.max(...data.map(l => l.precio ?? 0))
        setPrecioMaximo(maxPrecio)
        setPrecioMax(maxPrecio)
      } catch (e) {
        setError(true)
      } finally {
        setCargando(false)
      }
    }
    fetchLibros()
  }, [])

  // Listas únicas para los filtros — calculadas desde los datos del back
  const generos     = [...new Set(libros.map(l => l.genero).filter(Boolean))]
  const autores     = [...new Set(libros.flatMap(l => l.autores ?? []).filter(Boolean))]
  const editoriales = [...new Set(libros.map(l => l.editorial).filter(Boolean))]

  const handleGenero = (genero) => {
    if (generosSeleccionados.includes(genero)) {
      setGenerosSeleccionados(generosSeleccionados.filter(g => g !== genero))
    } else {
      setGenerosSeleccionados([...generosSeleccionados, genero])
    }
  }

  // FILTRADO en el front sobre los datos del back
  const librosFiltrados = libros.filter(libro => {
    const cumplePrecio    = (libro.precio ?? 0) <= precioMax
    const cumpleAutor     = autorSeleccionado === '' || (libro.autores ?? []).includes(autorSeleccionado)
    const cumpleEditorial = editorialSeleccionada === '' || libro.editorial === editorialSeleccionada
    const cumpleGenero    = generosSeleccionados.length === 0 || generosSeleccionados.includes(libro.genero)
    return cumplePrecio && cumpleAutor && cumpleEditorial && cumpleGenero
  })

  // Mapea el libro del back al formato que espera LibroCard
  const mapearLibro = (libro) => ({
    id:             libro.idLibro,
    titulo:         libro.titulo,
    autor:          libro.autores?.join(', ') ?? '',
    editorial:      libro.editorial,
    genero:         libro.genero,
    precioOriginal: libro.precio,
    descuento:      libro.porcentajeDescuento ? `-${libro.porcentajeDescuento}%` : null,
    descripcion:    libro.descripcion,
    imagen:         libro.imagen ? `data:image/jpeg;base64,${libro.imagen}` : null,
    tieneDetalle:   true,
  })

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-10">

      <h1 className="text-4xl font-bold text-[#2d2640] mb-10" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Catálogo completo
      </h1>

      <p className="text-sm text-gray-500 mb-10 max-w-2xl" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Tu próxima obsesión literaria podría estar a una página de distancia.
      </p>

      {/* Estado de carga */}
      {cargando && (
        <div className="flex justify-center items-center py-32">
          <p className="text-gray-400 text-sm">Cargando catálogo...</p>
        </div>
      )}

      {/* Error de conexión */}
      {error && (
        <div className="flex justify-center items-center py-32">
          <p className="text-gray-400 text-sm">No se pudo conectar con el servidor. Intentá de nuevo más tarde.</p>
        </div>
      )}

      {/* Contenido */}
      {!cargando && !error && (
        <div className="flex gap-12">

          {/* PANEL DE FILTROS */}
          <aside className="w-72 bg-white p-6 shadow-sm rounded">

            <h2 className="text-xl text-[#2d2640] mb-6">Filtrar por</h2>

            {/* FILTRO POR GÉNERO */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Géneros</h3>
              {generos.map(genero => (
                <label key={genero} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={generosSeleccionados.includes(genero)}
                    onChange={() => handleGenero(genero)}
                  />
                  {genero}
                </label>
              ))}
            </div>

            {/* FILTRO POR PRECIO */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Precio máximo</h3>
              <input
                type="range"
                min="0"
                max={precioMaximo}
                step="1000"
                value={precioMax}
                onChange={e => setPrecioMax(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Hasta ${precioMax.toLocaleString()}
              </p>
            </div>

            {/* FILTRO POR AUTOR */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Autor</h3>
              <select
                value={autorSeleccionado}
                onChange={e => setAutorSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Todos</option>
                {autores.map(autor => (
                  <option key={autor} value={autor}>{autor}</option>
                ))}
              </select>
            </div>

            {/* FILTRO POR EDITORIAL */}
            <div>
              <h3 className="font-medium mb-3">Editorial</h3>
              <div className="flex flex-wrap gap-2">
                {editoriales.map(editorial => (
                  <button
                    key={editorial}
                    onClick={() => setEditorialSeleccionada(
                      editorialSeleccionada === editorial ? '' : editorial
                    )}
                    className={
                      editorialSeleccionada === editorial
                        ? 'bg-[#7B5B98] text-white px-3 py-2 rounded text-sm transition'
                        : 'bg-white text-[#7B5B98] border border-[#7B5B98] px-3 py-2 rounded text-sm hover:bg-[#EBE5F2] transition'
                    }
                  >
                    {editorial}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* GRID DE LIBROS */}
          <section className="flex-1">
            {librosFiltrados.length === 0 ? (
              <p className="text-gray-400 text-sm py-16 text-center">
                No se encontraron libros con los filtros seleccionados.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-8">
                {librosFiltrados.map(libro => (
                  <LibroCard
                    key={libro.idLibro}
                    {...mapearLibro(libro)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      )}

    </div>
  )
}

export default Catalogo