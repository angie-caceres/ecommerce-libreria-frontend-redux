// VISTA — gestión de editoriales del panel admin
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const editorialesIniciales = [
  { id: '#ED-1', nombre: 'Penguin',            libros: 87  },
  { id: '#ED-2', nombre: 'Edificio',           libros: 142 },
  { id: '#ED-3', nombre: 'Bolivia Editorial',  libros: 95  },
  { id: '#ED-4', nombre: 'Novelle',            libros: 63  },
  { id: '#ED-5', nombre: 'Classic',            libros: 54  },
  { id: '#ED-6', nombre: 'Italic',             libros: 38  },
  { id: '#ED-7', nombre: 'Ediedi',             libros: 71  },
  { id: '#ED-8', nombre: 'Ejemplar',           libros: 29  },
  { id: '#ED-9', nombre: 'Librástica',         libros: 46  },
]

const POR_PAGINA = 9
const inputClass = "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionEditoriales() {

  // HOOK useState — estados locales del componente
  // (PDF: Estados locales y props - useState)
  const [lista, setLista]       = useState(editorialesIniciales)
  const [pagina, setPagina]     = useState(1)
  const [modal, setModal]       = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [nombre, setNombre]     = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const abrirCrear = () => { setNombre(''); setEditItem(null); setModal('crear') }
  const abrirEditar = (editorial) => { setNombre(editorial.nombre); setEditItem(editorial); setModal('editar') }
  const cerrarModal = () => { setModal(null); setDeleteId(null) }

  // EVENTO — crea o edita una editorial
  // (PDF: Estados locales y props - Eventos)
  const handleAceptar = () => {
    if (!nombre.trim()) return
    if (modal === 'editar' && editItem) {
      setLista(lista.map(e => e.id === editItem.id ? { ...e, nombre: nombre.trim() } : e))
    } else {
      const nuevoId = `#ED-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, nombre: nombre.trim(), libros: 0 }])
    }
    cerrarModal()
  }

  const handleEliminar = () => {
    setLista(lista.filter(e => e.id !== deleteId))
    cerrarModal()
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título y botón
              (PDF: Exposición de experto - Componentes reutilizables) */}
          <EncabezadoSeccion
            titulo="Gestión de editoriales"
            textBoton="Nueva Editorial"
            onAccion={abrirCrear}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "NOMBRE", "CANTIDAD DE LIBROS", "ACCIONES"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()
                      (PDF: Renderizado condicional - Listas) */}
                  {paginados.map(editorial => (
                    <tr key={editorial.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">{editorial.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{editorial.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {editorial.libros} {editorial.libros === 1 ? 'libro' : 'libros'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(editorial)} className="text-gray-400 hover:text-purple-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteId(editorial.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginados.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">No se encontraron editoriales.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="editoriales" onPageChange={setPagina} />
          </div>

          {/* RENDERIZADO CONDICIONAL con &&
              (PDF: Renderizado condicional - Operador &&) */}
          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Editorial' : 'Nueva Editorial'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!nombre.trim()}
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Nombre de la editorial
                </label>
                <input
                  autoFocus
                  className={inputClass}
                  placeholder="Ej: Argentina Editorial"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAceptar()}
                />
              </div>
            </ModalFormulario>
          )}

          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar editorial"
              mensaje="¿Estás seguro de que querés eliminar esta editorial? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionEditoriales