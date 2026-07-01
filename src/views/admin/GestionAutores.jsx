// VISTA — gestión de autores del panel admin
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react'
import HeaderAdmin from '../../components/HeaderAdmin'
import Sidebar from '../../components/Sidebar'
import Pagination from '../../components/Pagination'
import ModalFormulario from '../../components/ModalFormulario'
import ModalConfirmacion from '../../components/ModalConfirmacion'
import EncabezadoSeccion from '../../components/EncabezadoSeccion'
import { fetchAutores, crearAutor, editarAutor, eliminarAutor } from '../../redux/autoresSlice'

const POR_PAGINA = 9
const inputClass = "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionAutores() {
  const dispatch = useDispatch()

  const { items: lista, loading: cargando, error, status, } = useSelector(state => state.autores) //store de redux

  // HOOK useState — estados locales del componente
  const [pagina, setPagina]           = useState(1)
  const [modal, setModal]             = useState(null)   // 'crear' 'editar' null
  const [editItem, setEditItem]       = useState(null)
  const [nombre, setNombre]           = useState('')
  const [apellido, setApellido]       = useState('')
  const [nacionalidad, setNacionalidad] = useState('')
  const [deleteId, setDeleteId]       = useState(null)
  const [errorModal, setErrorModal]   = useState(null)
 
  // useEffect, carga la lista de autores desde el backend al montar el componente
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAutores())
    }
  }, [dispatch, status])

  // Paginación
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados    = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
 
  // Handlers de modal
  const abrirCrear = () => {
    setNombre(''); setApellido(''); setNacionalidad('')
    setEditItem(null); setErrorModal(null); setModal('crear')
  }
 
  const abrirEditar = (autor) => {
    setNombre(autor.nombre); setApellido(autor.apellido); setNacionalidad(autor.nacionalidad)
    setEditItem(autor); setErrorModal(null); setModal('editar')
  }
 
  const cerrarModal = () => { setModal(null); setDeleteId(null); setErrorModal(null) }
 
  //Crear y Editar
  const handleAceptar = async () => {
    if (!nombre.trim() || !apellido.trim()) return
    setErrorModal(null)
 
    const payload = {
      nombre:       nombre.trim(),
      apellido:     apellido.trim(),
      nacionalidad: nacionalidad.trim(),
    }
 
    let resultado
 
    if (modal === 'editar' && editItem) {
      resultado = await dispatch(editarAutor({ id: editItem.id, cambios: payload }))
    } else {
      resultado = await dispatch(crearAutor(payload))
    }
 
    if (crearAutor.fulfilled.match(resultado) || editarAutor.fulfilled.match(resultado)) {
      cerrarModal()
    } else {
      setErrorModal(resultado.error?.message || 'Error al procesar la solicitud.')
    }
  }
 
  // Eliminar
  const handleEliminar = async () => {
    if (!deleteId) return
    const resultado = await dispatch(eliminarAutor(deleteId))
    if (eliminarAutor.fulfilled.match(resultado)) {
      cerrarModal()
    } else {
      cerrarModal()
      // El error ya queda en state.autores.error — se muestra en la vista
    }
  }
 
  // Renderizado
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">
 
          <EncabezadoSeccion
            titulo="Gestión de autores"
            textBoton="Nuevo Autor"
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
                    {['ID', 'AUTOR', 'NACIONALIDAD', 'ACCIONES'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
 
                  {cargando && lista.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm animate-pulse">
                        Cargando autores...
                      </td>
                    </tr>
                  )}
 
                  {!cargando && paginados.map(autor => (
                    <tr key={autor.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">#{autor.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">
                            {autor.nombre} {autor.apellido}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{autor.nacionalidad || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(autor)} className="text-gray-400 hover:text-purple-600 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(autor.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
 
                  {!cargando && paginados.length === 0 && !error && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No se encontraron autores en la base de datos.
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
              itemLabel="autores"
              onPageChange={setPagina}
            />
          </div>
 
          {/* Modal crear / editar */}
          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Autor' : 'Nuevo Autor'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!nombre.trim() || !apellido.trim() || cargando}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Nombre
                  </label>
                  <input
                    autoFocus
                    className={inputClass}
                    placeholder="Ej: Gabriel"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !cargando && handleAceptar()}
                    disabled={cargando}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Apellido
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Ej: García Márquez"
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !cargando && handleAceptar()}
                    disabled={cargando}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Nacionalidad
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Ej: Colombia"
                    value={nacionalidad}
                    onChange={e => setNacionalidad(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !cargando && handleAceptar()}
                    disabled={cargando}
                  />
                </div>
                {errorModal && (
                  <p className="text-xs text-red-500">{errorModal}</p>
                )}
              </div>
            </ModalFormulario>
          )}
 
          {/* Modal confirmación eliminar */}
          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar autor"
              mensaje="¿Estás seguro de que querés eliminar este autor? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}
 
        </main>
      </div>
    </div>
  )
}
 
export default GestionAutores