// VISTA — gestión de géneros del panel admin
import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { apiFetch } from '../../services/api'

const POR_PAGINA = 9

const inputClass =
  "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionGeneros() {
  const token =
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("token")

  const [lista, setLista] = useState([])
  const [pagina, setPagina] = useState(1)
  const [modal, setModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [nombre, setNombre] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargarGeneros = async () => {
    setCargando(true)
    setError(null)

    try {
      const data = await apiFetch('/generos', token)

      const datosFormateados = data.map(g => ({
        id: g.id || g.idGenero,
        nombre: g.nombre
      }))

      setLista(datosFormateados)
    } catch (err) {
      setError('No se pudieron cargar los géneros desde el servidor.')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarGeneros()
  }, [])

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  )

  const abrirCrear = () => {
    setNombre('')
    setEditItem(null)
    setModal('crear')
  }

  const abrirEditar = (genero) => {
    setNombre(genero.nombre)
    setEditItem(genero)
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(null)
    setDeleteId(null)
  }

  const handleAceptar = async () => {
    if (!nombre.trim()) return

    setCargando(true)

    try {
      const payload = {
        nombre: nombre.trim()
      }

      if (modal === 'editar' && editItem) {
        await apiFetch(`/generos/${editItem.id}`, token, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
      } else {
        await apiFetch('/generos', token, {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }

      cerrarModal()
      cargarGeneros()
    } catch (err) {
      alert(err.message || 'Error al procesar la solicitud en el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const handleEliminar = async () => {
    if (!deleteId) return

    setCargando(true)

    try {
      await apiFetch(`/generos/${deleteId}`, token, {
        method: 'DELETE'
      })

      cerrarModal()
      cargarGeneros()
    } catch (err) {
      alert('No se pudo eliminar el género. Verificá si no tiene libros asociados.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />

      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin token={token} />

        <main className="flex-1 p-8 space-y-6">
          <EncabezadoSeccion
            titulo="Gestión de géneros"
            textBoton="Nuevo Género"
            onAccion={abrirCrear}
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold bg-red-50 p-4 rounded-xl border border-red-100">
              ⚠️ {error}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "NOMBRE", "ACCIONES"].map(h => (
                      <th
                        key={h}
                        className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {cargando && lista.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-16 text-center text-gray-400 text-sm animate-pulse"
                      >
                        Cargando géneros desde MySQL...
                      </td>
                    </tr>
                  )}

                  {!cargando && paginados.map(genero => (
                    <tr
                      key={genero.id}
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        #{genero.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">
                            {genero.nombre}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => abrirEditar(genero)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => setDeleteId(genero.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!cargando && paginados.length === 0 && !error && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-16 text-center text-gray-400 text-sm"
                      >
                        No hay géneros registrados en la base de datos.
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
              itemLabel="géneros"
              onPageChange={setPagina}
            />
          </div>

          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Género' : 'Nuevo Género'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!nombre.trim() || cargando}
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Nombre del género
                </label>

                <input
                  autoFocus
                  className={inputClass}
                  placeholder="Ej: Ciencia ficción"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  onKeyDown={e =>
                    e.key === 'Enter' && !cargando && handleAceptar()
                  }
                  disabled={cargando}
                />
              </div>
            </ModalFormulario>
          )}

          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar género"
              mensaje="¿Estás seguro de que querés eliminar este género? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default GestionGeneros