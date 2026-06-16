// VISTA — página que muestra todos los libros disponibles
import { useState, useEffect } from 'react'
import LibroCard from '../components/LibroCard'
import { apiFetch } from '../services/api'
import { calcularPrecioFinal } from '../utils/calcularPrecio'

function Catalogo() {

  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [precioMax, setPrecioMax] = useState(200000)
  const [autorSeleccionado, setAutorSeleccionado] = useState('')
  const [editorialSeleccionada, setEditorialSeleccionada] = useState('')
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])

  const [generos, setGeneros] = useState([])
  const [autores, setAutores] = useState([])
  const [editoriales, setEditoriales] = useState([])

  useEffect(() => {
    apiFetch('/libros')
      .then(data => {
        const librosFormateados = data.map(libro => ({
          id: libro.idLibro,
          titulo: libro.titulo,
          autor: libro.autores?.join(', '),
          editorial: libro.editorial,
          genero: libro.genero,
          precio: libro.precio,
        }))
        setGeneros([...new Set(librosFormateados.map(l => l.genero).filter(Boolean))])
        setAutores([...new Set(librosFormateados.map(l => l.autor).filter(Boolean))])
        setEditoriales([...new Set(librosFormateados.map(l => l.editorial).filter(Boolean))])
      })
      .catch(err => setError('No se pudieron cargar los filtros.'))
  }, [])

  useEffect(() => {
    setCargando(true)

    const params = new URLSearchParams()
    if (editorialSeleccionada) params.append('editorial', editorialSeleccionada)
    if (generosSeleccionados.length === 1) params.append('genero', generosSeleccionados[0])
    if (precioMax < 200000) params.append('precioMax', precioMax)

    const url = `/libros${params.toString() ? `?${params.toString()}` : ''}`

    apiFetch(url)
      .then(data => {
        const librosFormateados = data.map(libro => {
          const descuento = libro.porcentajeDescuento ? `-${libro.porcentajeDescuento}%` : null
          return {
            id: libro.idLibro,
            titulo: libro.titulo,
            autor: libro.autores?.join(', '),
            editorial: libro.editorial,
            genero: libro.genero,
            precio: calcularPrecioFinal(libro.precio, descuento),
            precioOriginal: libro.precio,
            descuento,
            imagen: libro.imagen
              ? `data:image/jpeg;base64,${libro.imagen}`
              : '/libros/juegos.png',
          }
        })
        setLibros(librosFormateados)
      })
      .catch(err => setError('No se pudieron cargar los libros.'))
      .finally(() => setCargando(false))

  }, [editorialSeleccionada, generosSeleccionados, precioMax])

  const handleGenero = (genero) => {
    if (generosSeleccionados.includes(genero)) {
      setGenerosSeleccionados(generosSeleccionados.filter(g => g !== genero))
    } else {
      setGenerosSeleccionados([...generosSeleccionados, genero])
    }
  }

  const librosFiltrados = autorSeleccionado
    ? libros.filter(libro => libro.autor === autorSeleccionado)
    : libros

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-10">

      <h1 className="text-4xl font-bold text-[#2d2640] mb-10" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Catálogo completo
      </h1>

      <p className="text-sm text-gray-500 mb-10 max-w-2xl" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Tu próxima obsesión literaria podría estar a una página de distancia.
      </p>

      {error && (
        <p className="text-center text-red-400 text-sm uppercase tracking-widest mt-20">
          {error}
        </p>
      )}

      {!error && (
        <div className="flex gap-12">

          <aside className="w-72 bg-white p-6 shadow-sm rounded">

            <h2 className="text-xl text-[#2d2640] mb-6">Filtrar por</h2>

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

            <div className="mb-8">
              <h3 className="font-medium mb-3">Precio máximo</h3>
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Hasta ${precioMax.toLocaleString()}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-3">Autor</h3>
              <select
                value={autorSeleccionado}
                onChange={(e) => setAutorSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Todos</option>
                {autores.map(autor => (
                  <option key={autor} value={autor}>{autor}</option>
                ))}
              </select>
            </div>

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

          <section className="flex-1">

            {cargando && (
              <p className="text-center text-gray-400 text-sm uppercase tracking-widest mt-20">
                Cargando libros...
              </p>
            )}

            {!cargando && librosFiltrados.length === 0 && (
              <p className="text-center text-gray-400 text-sm uppercase tracking-widest mt-20">
                No se encontraron libros con esos filtros.
              </p>
            )}

            {!cargando && (
              <div className="grid grid-cols-4 gap-8">
                {librosFiltrados.map(libro => (
                  <LibroCard
                    key={libro.id}
                    {...libro}
                    tieneDetalle={true}
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