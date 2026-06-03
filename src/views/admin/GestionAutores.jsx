// VISTA — gestión de autores del panel admin
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { Pencil, Trash2 } from 'lucide-react'

const autoresIniciales = [
  { id: '#AUT-1', nombre: 'Jorge Luis Borges',      nacionalidad: 'Argentino',      libros: 8  },
  { id: '#AUT-2', nombre: 'Pablo Neruda',            nacionalidad: 'Chileno',        libros: 6  },
  { id: '#AUT-3', nombre: 'J.K. Rowling',            nacionalidad: 'Británica',      libros: 7  },
  { id: '#AUT-4', nombre: 'Suzanne Collins',         nacionalidad: 'Estadounidense', libros: 4  },
  { id: '#AUT-5', nombre: 'Julio Verne',             nacionalidad: 'Francés',        libros: 3  },
  { id: '#AUT-6', nombre: 'Stephen King',            nacionalidad: 'Estadounidense', libros: 12 },
  { id: '#AUT-7', nombre: 'Mario Benedetti',         nacionalidad: 'Uruguayo',       libros: 2  },
  { id: '#AUT-8', nombre: 'Gabriel García Márquez',  nacionalidad: 'Colombiano',     libros: 5  },
  { id: '#AUT-9', nombre: 'Jane Austen',             nacionalidad: 'Británica',      libros: 8  },
]

const POR_PAGINA = 9
const inputClass = "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionAutores() {

  // HOOK useState — estados locales del componente
  // (PDF: Estados locales y props - useState)
  const [lista, setLista]             = useState(autoresIniciales)
  const [pagina, setPagina]           = useState(1)
  const [modal, setModal]             = useState(null)
  const [editItem, setEditItem]       = useState(null)
  const [nombre, setNombre]           = useState('')
  const [nacionalidad, setNacionalidad] = useState('')
  const [deleteId, setDeleteId]       = useState(null)

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const abrirCrear = () => { setNombre(''); setNacionalidad(''); setEditItem(null); setModal('crear') }
  const abrirEditar = (autor) => { setNombre(autor.nombre); setNacionalidad(autor.nacionalidad || ''); setEditItem(autor); setModal('editar') }
  const cerrarModal = () => { setModal(null); setDeleteId(null) }

  // EVENTO — crea o edita un autor
  // (PDF: Estados locales y props - Eventos)
  const handleAceptar = () => {
    if (!nombre.trim()) return
    if (modal === 'editar' && editItem) {
      setLista(lista.map(a => a.id === editItem.id ? { ...a, nombre: nombre.trim(), nacionalidad: nacionalidad.trim() } : a))
    } else {
      const nuevoId = `#AUT-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, nombre: nombre.trim(), nacionalidad: nacionalidad.trim(), libros: 0 }])
    }
    cerrarModal()
  }

  const handleEliminar = () => {
    setLista(lista.filter(a => a.id !== deleteId))
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
            titulo="Gestión de autores"
            textBoton="Nuevo Autor"
            onAccion={abrirCrear}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "AUTOR", "NACIONALIDAD", "LIBROS PUBLICADOS", "ACCIONES"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()
                      (PDF: Renderizado condicional - Listas) */}
                  {paginados.map(autor => (
                    <tr key={autor.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">{autor.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{autor.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{autor.nacionalidad || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{autor.libros} {autor.libros === 1 ? 'libro' : 'libros'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(autor)} className="text-gray-400 hover:text-purple-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteId(autor.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginados.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">No se encontraron autores registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="autores" onPageChange={setPagina} />
          </div>

          {/* RENDERIZADO CONDICIONAL con &&
              (PDF: Renderizado condicional - Operador &&) */}
          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Autor' : 'Nuevo Autor'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!nombre.trim()}
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Nombre completo del autor</label>
                <input autoFocus className={inputClass} placeholder="Ej: Gabriel García Márquez" value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAceptar()} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Nacionalidad</label>
                <input className={inputClass} placeholder="Ej: Argentina" value={nacionalidad} onChange={e => setNacionalidad(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAceptar()} />
              </div>
            </ModalFormulario>
          )}

          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar autor"
              mensaje="¿Estás seguro de que querés eliminar este autor? Esta acción removerá el perfil y desvinculará sus libros."
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