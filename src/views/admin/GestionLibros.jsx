// VISTA — gestión de libros del panel admin
import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../services/api"

const PALETA_COLORES = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-red-100 text-red-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
]

const getColorGenero = (genero) => {
  if (!genero) return 'bg-gray-100 text-gray-600'
  let hash = 0
  for (let i = 0; i < genero.length; i++) hash = genero.charCodeAt(i) + ((hash << 5) - hash)
  return PALETA_COLORES[Math.abs(hash) % PALETA_COLORES.length]
}

const getColorAutor = (autor) => {
  if (!autor) return 'bg-gray-100 text-gray-600'
  let hash = 0
  for (let i = 0; i < autor.length; i++) hash = autor.charCodeAt(i) + ((hash << 5) - hash)
  return PALETA_COLORES[Math.abs(hash) % PALETA_COLORES.length]
}

const POR_PAGINA = 9

function GestionLibros({ token }) {

  const navigate = useNavigate()

  const [lista, setLista]       = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState(null)
  const [pagina, setPagina]     = useState(1)
  const [toggleId, setToggleId] = useState(null)

  useEffect(() => {
    apiFetch('/libros/todos', token)
      .then(data => {
        setLista(data.map(libro => ({
          id:             libro.idLibro,
          titulo:         libro.titulo,
          autor:          libro.autores?.join(', ') || 'Sin autor',
          genero:         libro.genero,
          precioOriginal: libro.precio,
          descuento:      libro.porcentajeDescuento ? `${libro.porcentajeDescuento}%` : '0%',
          stock:          libro.stock,
          activo:         !!libro.activo,
        })))
      })
      .catch(() => setError('No se pudieron cargar los libros.'))
      .finally(() => setCargando(false))
  }, [token])

  const totalPaginas    = Math.ceil(lista.length / POR_PAGINA)
  const paginados       = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
  const libroSeleccionado = lista.find(l => l.id === toggleId)

  const handleToggle = async () => {
    if (!toggleId || !libroSeleccionado) return
    setError(null)
    try {
      if (libroSeleccionado.activo) {
        await apiFetch(`/libros/${toggleId}`, token, { method: 'DELETE' })
      } else {
        await apiFetch(`/libros/${toggleId}/activar`, token, { method: 'PATCH' })
      }
      setLista(prev => prev.map(l => l.id === toggleId ? { ...l, activo: !l.activo } : l))
    } catch {
      setError(`No se pudo ${libroSeleccionado.activo ? 'desactivar' : 'activar'} el libro.`)
    } finally {
      setToggleId(null)
    }
  }

  const getPrecio = (libro) => {
    if (libro.descuento && libro.descuento !== '0%') {
      const porcentaje = parseFloat(libro.descuento)
      const final = libro.precioOriginal * (1 - porcentaje / 100)
      return `$${final.toLocaleString()} (-${libro.descuento})`
    }
    return `$${libro.precioOriginal?.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          <EncabezadoSeccion
            titulo="Gestión de libros"
            textBoton="Nuevo Libro"
            onAccion={() => navigate("/admin/libros/crear")}
          />

          {error && (
            <p className="text-center text-red-500 font-bold tracking-wide py-2 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </p>
          )}

          {cargando ? (
            <p className="text-center text-gray-400 text-sm uppercase tracking-widest py-16">
              Cargando libros...
            </p>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['ID', 'TÍTULO', 'AUTOR', 'GÉNERO', 'STOCK', 'PRECIO', 'ESTADO', 'ACCIONES'].map(h => (
                        <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginados.map(libro => (
                      <tr
                        key={libro.id}
                        className={`transition-colors ${
                          libro.activo
                            ? 'hover:bg-purple-50/30'
                            : 'bg-gray-50/60 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">#{libro.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{libro.titulo}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getColorAutor(libro.autor)}`}>
                            {libro.autor}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getColorGenero(libro.genero)}`}>
                            {libro.genero}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{libro.stock}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{getPrecio(libro)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            libro.activo
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${libro.activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {libro.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => navigate(`/admin/libros/editar/${libro.id}`)}
                              className="text-gray-400 hover:text-purple-600 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setToggleId(libro.id)}
                              className="text-xs px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                            >
                              {libro.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginados.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center text-gray-400 text-sm">
                          No hay libros registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={pagina}
                totalPages={totalPaginas}
                totalItems={lista.length}
                itemsPerPage={POR_PAGINA}
                itemLabel="libros"
                onPageChange={setPagina}
              />
            </div>
          )}

          {toggleId && libroSeleccionado && (
            <ModalConfirmacion
              titulo={libroSeleccionado.activo ? 'Desactivar libro' : 'Activar libro'}
              mensaje={
                libroSeleccionado.activo
                  ? `¿Desactivar "${libroSeleccionado.titulo}"?`
                  : `¿Activar "${libroSeleccionado.titulo}"?`
              }
              onCancelar={() => setToggleId(null)}
              onConfirmar={handleToggle}
              textoConfirmar={libroSeleccionado.activo ? 'DESACTIVAR' : 'ACTIVAR'}
              variante={libroSeleccionado.activo ? 'danger' : 'primary'}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionLibros
