// COMPONENTE — Vista de gestión de editoriales del panel de administrador
import { useState } from 'react'
import { Trash2, Plus, X, Pencil } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";

// DATOS DE PRUEBA
const editorialesIniciales = [
  { id: '#ED-1', nombre: 'Penguin',           libros: 87  },
  { id: '#ED-2', nombre: 'Edificio',           libros: 142 },
  { id: '#ED-3', nombre: 'Bolivia Editorial',  libros: 95  },
  { id: '#ED-4', nombre: 'Novelle',           libros: 63  },
  { id: '#ED-5', nombre: 'Classic',           libros: 54  },
  { id: '#ED-6', nombre: 'Italic',            libros: 38  },
  { id: '#ED-7', nombre: 'Ediedi',            libros: 71  },
  { id: '#ED-8', nombre: 'Ejemplar',          libros: 29  },
  { id: '#ED-9', nombre: 'Librástica',        libros: 46  },
]

const POR_PAGINA = 9

function GestionEditoriales() {

  // ESTADOS — Control de la lista, paginación y modales
  const [lista, setLista]       = useState(editorialesIniciales)
  const [pagina, setPagina]     = useState(1)
  const [modal, setModal]       = useState(null)   // null | 'crear' | 'editar'
  const [editItem, setEditItem] = useState(null)   
  const [nombre, setNombre]     = useState('')
  const [deleteId, setDeleteId] = useState(null)   

  // PAGINACIÓN — calcula qué items mostrar según la página actual
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // HANDLERS — funciones que manejan eventos de la UI
  const abrirCrear = () => {
    setNombre('')
    setEditItem(null)
    setModal('crear')
  }

  const abrirEditar = (editorial) => {
    setNombre(editorial.nombre)
    setEditItem(editorial)
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(null)
    setDeleteId(null)
  }

  // Crea o edita una editorial según el modal abierto
  const handleAceptar = () => {
    if (!nombre.trim()) return

    if (modal === 'editar' && editItem) {
      setLista(lista.map(g =>
        g.id === editItem.id ? { ...g, nombre: nombre.trim() } : g
      ))
    } else {
      const nuevoId = `#ED-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, nombre: nombre.trim(), libros: 0 }])
    }

    cerrarModal()
  }

  // ELIMINAR — filtra el array quitando la editorial con ese id
  const handleEliminar = () => {
    setLista(lista.filter(g => g.id !== deleteId))
    cerrarModal()
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-sans">

      {/* Menú lateral fijo */}
      <Sidebar />

      {/* Columna principal — ml-56 evita superposiciones con la sidebar */}
      <div className="ml-56 min-h-screen flex flex-col">

        {/* Barra superior */}
        <HeaderAdmin />

        {/* Contenido de la página */}
        <main className="flex-1 p-8 space-y-6">

          {/* Bloque superior: Título, descripción y botón unificado */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Gestión de editoriales</h2>
            </div>
            <div>
              <button
                onClick={abrirCrear}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity bg-purple-600 shadow-sm uppercase tracking-wider"
              >
                <Plus size={14} />
                Nueva Editorial
              </button>
            </div>
          </div>

          {/* TARJETA / CONTENEDOR DE LA TABLA */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "NOMBRE", "CANTIDAD DE LIBROS", "ACCIONES"].map((header) => (
                      <th 
                        key={header} 
                        className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {paginados.map((editorial) => (
                    <tr 
                      key={editorial.id} 
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        {editorial.id}
                      </td>

                      {/* Nombre con indicador circular */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">
                            {editorial.nombre}
                          </span>
                        </div>
                      </td>

                      {/* Cantidad de libros */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {editorial.libros} {editorial.libros === 1 ? 'libro' : 'libros'}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => abrirEditar(editorial)} 
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(editorial.id)} 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No se encontraron editoriales cargadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* COMPONENTE Paginación */}
            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              totalItems={lista.length}
              itemsPerPage={POR_PAGINA}
              itemLabel="editoriales"
              onPageChange={setPagina}
            />

          </div>

          {/* Modal Crear / Editar */}
          {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={cerrarModal} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

                <div className="flex items-center justify-between mb-5">
                  <span className="font-semibold text-gray-800">
                    {modal === 'editar' ? 'Editar Editorial' : 'Nueva Editorial'}
                  </span>
                  <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Nombre de la editorial
                    </label>
                    <input
                      autoFocus
                      className="w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Ej: Argentina Editorial"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAceptar()}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={cerrarModal} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wider">
                      CANCELAR
                    </button>
                    <button
                      onClick={handleAceptar}
                      disabled={!nombre.trim()}
                      className="px-5 py-2 rounded-lg text-white text-xs font-semibold uppercase hover:opacity-90 disabled:opacity-40 transition-opacity bg-[#2d2660]"
                    >
                      ACEPTAR
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Modal Confirmación de Borrado */}
          {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={cerrarModal} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-800">Eliminar editorial</span>
                  <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-5">
                  ¿Estás seguro de que querés eliminar esta editorial? Esta acción no se puede deshacer y afectará a los libros vinculados.
                </p>

                <div className="flex justify-end gap-3">
                  <button onClick={cerrarModal} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wider">
                    CANCELAR
                  </button>
                  <button onClick={handleEliminar} className="px-5 py-2 rounded-lg text-white text-xs font-semibold uppercase bg-red-500 hover:bg-red-600 transition-colors">
                    ELIMINAR
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionEditoriales