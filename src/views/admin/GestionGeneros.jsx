// VISTA — gestión de géneros del panel admin
// Los géneros se obtienen y modifican a través del store de Redux

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react'
import HeaderAdmin from '../../components/HeaderAdmin'
import Sidebar from '../../components/Sidebar'
import Pagination from '../../components/Pagination'
import ModalFormulario from '../../components/ModalFormulario'
import ModalConfirmacion from '../../components/ModalConfirmacion'
import EncabezadoSeccion from '../../components/EncabezadoSeccion'
import { fetchGeneros, crearGenero, editarGenero, eliminarGenero } from '../../redux/generosSlice'
import Swal from 'sweetalert2'

const POR_PAGINA = 9
const inputClass =
  'w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100'

function GestionGeneros() {
  const dispatch = useDispatch()

  const { items: lista, loading: cargando, error, status } = useSelector(state => state.generos) //Store de Redux

  // Estados locales UI
  const [pagina, setPagina]       = useState(1)
  const [modal, setModal]         = useState(null)  // 'crear' 'editar' null
  const [editItem, setEditItem]   = useState(null)
  const [nombre, setNombre]       = useState('')
  const [deleteId, setDeleteId]   = useState(null)
  const [errorModal, setErrorModal] = useState(null)

  // useEffect, carga la lista de géneros desde el backend al montar el componente
  useEffect(() => {
    if(status === 'idle'){
      dispatch(fetchGeneros())
    }
  }, [dispatch, status])

  // Paginación
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados    = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // Handlers de modal
  const abrirCrear = () => {
    setNombre(''); setEditItem(null); setErrorModal(null); setModal('crear')
  }

  const abrirEditar = (genero) => {
    setNombre(genero.nombre); setEditItem(genero); setErrorModal(null); setModal('editar')
  }

  const cerrarModal = () => { setModal(null); setDeleteId(null); setErrorModal(null) }

  // Creaar y editar
  const handleAceptar = async () => {
    if (!nombre.trim()) return
    setErrorModal(null)

    const payload = { nombre: nombre.trim() }

    let resultado

    if (modal === 'editar' && editItem) {
      resultado = await dispatch(editarGenero({ id: editItem.id, cambios: payload }))
    } else {
      resultado = await dispatch(crearGenero(payload))
    }

    if (crearGenero.fulfilled.match(resultado) || editarGenero.fulfilled.match(resultado)) {
      cerrarModal()
    } else {
      setErrorModal(resultado.error?.message || 'Error al procesar la solicitud.')
    }
  }

  // Eliminar
  const handleEliminar = async () => {
    if (!deleteId) return

    const respuesta = await dispatch(eliminarGenero(deleteId))

    if (eliminarGenero.fulfilled.match(respuesta)) {
      Swal.fire({
        title: '¡Eliminado!',
        text: 'El género fue eliminado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      const mensajeError =
        respuesta.payload || respuesta.error?.message || ''

      const generoEnUso =
        mensajeError.toLowerCase().includes('libro') ||
        mensajeError.toLowerCase().includes('constraint') ||
        mensajeError.toLowerCase().includes('foreign key')

      Swal.fire({
        title: generoEnUso ? 'Género en uso' : 'Error',
        text: generoEnUso
          ? 'No se puede eliminar este género porque está asociado a uno o más libros.'
          : 'No se pudo eliminar el género.',
        icon: generoEnUso ? 'warning' : 'error',
      })
    }

    cerrarModal()
  }

  // Renderizado
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
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
                    {['ID', 'NOMBRE', 'ACCIONES'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">

                  {cargando && lista.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center text-gray-400 text-sm animate-pulse">
                        Cargando géneros...
                      </td>
                    </tr>
                  )}

                  {!cargando && paginados.map(genero => (
                    <tr key={genero.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">#{genero.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{genero.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(genero)} className="text-gray-400 hover:text-purple-600 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(genero.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!cargando && paginados.length === 0 && !error && (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center text-gray-400 text-sm">
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
                  onKeyDown={e => e.key === 'Enter' && !cargando && handleAceptar()}
                  disabled={cargando}
                />
                {errorModal && <p className="text-xs text-red-500 mt-2">{errorModal}</p>}
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