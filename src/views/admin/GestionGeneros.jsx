// VISTA — gestión de géneros del panel admin
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const generosIniciales = [
  { id: '#GEN-1', nombre: 'Fantasía',            libros: 87  },
  { id: '#GEN-2', nombre: 'Ficción',             libros: 142 },
  { id: '#GEN-3', nombre: 'Novela',              libros: 95  },
  { id: '#GEN-4', nombre: 'Novela corta',        libros: 63  },
  { id: '#GEN-5', nombre: 'Clásicos Literarios', libros: 54  },
  { id: '#GEN-6', nombre: 'Terror',              libros: 38  },
  { id: '#GEN-7', nombre: 'Ciencia ficción',     libros: 71  },
  { id: '#GEN-8', nombre: 'Histórica',           libros: 29  },
  { id: '#GEN-9', nombre: 'Romántica',           libros: 46  },
]

const POR_PAGINA = 9
const inputClass = "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionGeneros() {

  // HOOK useState — estados locales del componente
  const [lista, setLista]       = useState(generosIniciales)
  const [pagina, setPagina]     = useState(1)
  const [modal, setModal]       = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [nombre, setNombre]     = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const abrirCrear = () => { setNombre(''); setEditItem(null); setModal('crear') }
  const abrirEditar = (genero) => { setNombre(genero.nombre); setEditItem(genero); setModal('editar') }
  const cerrarModal = () => { setModal(null); setDeleteId(null) }

  // EVENTO — crea o edita un género
  const handleAceptar = () => {
    if (!nombre.trim()) return
    if (modal === 'editar' && editItem) {
      setLista(lista.map(g => g.id === editItem.id ? { ...g, nombre: nombre.trim() } : g))
    } else {
      const nuevoId = `#GEN-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, nombre: nombre.trim(), libros: 0 }])
    }
    cerrarModal()
  }

  const handleEliminar = () => {
    setLista(lista.filter(g => g.id !== deleteId))
    cerrarModal()
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título y botón  */}
          <EncabezadoSeccion
            titulo="Gestión de géneros"
            textBoton="Nuevo Género"
            onAccion={abrirCrear}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "NOMBRE", "LIBROS", "ACCIONES"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()  */}
                  {paginados.map(genero => (
                    <tr key={genero.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">{genero.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{genero.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{genero.libros} libros</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(genero)} className="text-gray-400 hover:text-purple-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteId(genero.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginados.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">No hay géneros registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="géneros" onPageChange={setPagina} />
          </div>

          {/* RENDERIZADO CONDICIONAL con &&  */}
          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Género' : 'Nuevo Género'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!nombre.trim()}
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
                  onKeyDown={e => e.key === 'Enter' && handleAceptar()}
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