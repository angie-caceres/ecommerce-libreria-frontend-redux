// VISTA — gestión de libros del panel admin
import { useState, useEffect } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../services/api"

// Paleta de colores disponibles — se asignan dinámicamente a cada género/autor
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

// FUNCIÓN — genera un color consistente para cada género según su nombre
const getColorGenero = (genero) => {
  if (!genero) return 'bg-gray-100 text-gray-600'
  let hash = 0
  for (let i = 0; i < genero.length; i++) {
    hash = genero.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PALETA_COLORES.length
  return PALETA_COLORES[index]
}

// FUNCIÓN — genera un color consistente para cada autor según su nombre
const getColorAutor = (autor) => {
  if (!autor) return 'bg-gray-100 text-gray-600'
  let hash = 0
  for (let i = 0; i < autor.length; i++) {
    hash = autor.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PALETA_COLORES.length
  return PALETA_COLORES[index]
}

const POR_PAGINA = 9

function GestionLibros({ token }) {

  const navigate = useNavigate()

  // HOOK useState — libros traídos del backend
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [pagina, setPagina] = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  // HOOK useEffect — trae los libros del backend al montar
  useEffect(() => {
    apiFetch('/libros', token)
      .then(data => {
        const librosFormateados = data.map(libro => ({
          id: libro.idLibro,
          titulo: libro.titulo,
          autor: libro.autores?.join(', ') || 'Sin autor',
          genero: libro.genero,
          precioOriginal: libro.precio,
          descuento: libro.porcentajeDescuento ? `${libro.porcentajeDescuento}%` : '0%',
          stock: libro.stock,
        }))
        setLista(librosFormateados)
      })
      .catch(err => setError('No se pudieron cargar los libros.'))
      .finally(() => setCargando(false))
  }, [token])

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const cerrarModal = () => setDeleteId(null)

  // EVENTO — elimina un libro en el backend
  const handleEliminar = async () => {
    try {
      await apiFetch(`/libros/${deleteId}`, token, { method: 'DELETE' })
      setLista(lista.filter(l => l.id !== deleteId))
    } catch (err) {
      setError('No se pudo eliminar el libro.')
    } finally {
      cerrarModal()
    }
  }

  const getPrecio = (libro) => {
    if (libro.descuento && libro.descuento !== '0%') {
      const porcentaje = parseFloat(libro.descuento)
      const final = libro.precioOriginal * (1 - porcentaje / 100)
      return `$${final.toLocaleString()} (-${libro.descuento})`
    }
    return `$${libro.precioOriginal.toLocaleString()}`
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
                      {['ID', 'TÍTULO', 'AUTOR', 'GÉNERO', 'STOCK', 'PRECIO', 'ACCIONES'].map(h => (
                        <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginados.map(libro => (
                      <tr key={libro.id} className="hover:bg-purple-50/30 transition-colors">
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
                          <div className="flex items-center gap-4">
                            <button onClick={() => navigate(`/admin/libros/editar/${libro.id}`)} className="text-gray-400 hover:text-purple-600 transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteId(libro.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginados.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">No hay libros registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="libros" onPageChange={setPagina} />
            </div>
          )}

          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar libro"
              mensaje="¿Estás seguro de que querés eliminar este libro? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionLibros