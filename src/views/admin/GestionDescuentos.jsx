// VISTA — gestión de descuentos del panel admin
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { Pencil, Trash2 } from 'lucide-react'

export const descuentosIniciales = [
  { id: '#DESC-1', libro: 'Harry Potter y la piedra filosofal', porcentaje: '20%', activo: true },
  { id: '#DESC-2', libro: 'Los juegos del hambre',              porcentaje: '5%',  activo: true },
  { id: '#DESC-3', libro: 'Rayuela',                            porcentaje: '10%', activo: true },
  { id: '#DESC-4', libro: 'Submarino',                          porcentaje: '10%', activo: true },
  { id: '#DESC-5', libro: 'Sherlock Holmes: Estudio en escarlata', porcentaje: '15%', activo: true },
  { id: '#DESC-6', libro: 'Lobo estepario',                     porcentaje: '30%', activo: true },
  { id: '#DESC-7', libro: 'El laberinto de la soledad',         porcentaje: '20%', activo: true },
  { id: '#DESC-8', libro: 'Caperucita Roja',                    porcentaje: '10%', activo: true },
  { id: '#DESC-9', libro: 'Floricienta: El cuento original',    porcentaje: '20%', activo: true },
]

const LIBROS_DISPONIBLES = [
  'Harry Potter y la piedra filosofal', 'Harry Potter y la cámara secreta',
  'Los juegos del hambre', 'En llamas', 'Sinsajo', 'Rayuela', 'Submarino',
  'Sherlock Holmes: Estudio en escarlata', 'El sabueso de los Baskerville',
  'Lobo estepario', 'El laberinto de la soledad', 'Caperucita Roja',
  'Floricienta: El cuento original', 'Cien años de soledad', 'Ficciones'
]

const POR_PAGINA = 9
const inputClass = "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionDescuentos() {

  // HOOK useState — estados locales del componente
  // (PDF: Estados locales y props - useState)
  const [lista, setLista]                         = useState(descuentosIniciales)
  const [pagina, setPagina]                       = useState(1)
  const [modal, setModal]                         = useState(null)
  const [editItem, setEditItem]                   = useState(null)
  const [deleteId, setDeleteId]                   = useState(null)
  const [libro, setLibro]                         = useState('')
  const [porcentaje, setPorcentaje]               = useState('')
  const [activo, setActivo]                       = useState(true)
  const [sugerencias, setSugerencias]             = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const abrirCrear = () => { setLibro(''); setPorcentaje(''); setActivo(true); setSugerencias([]); setMostrarSugerencias(false); setEditItem(null); setModal('crear') }
  const abrirEditar = (d) => { setLibro(d.libro); setPorcentaje(d.porcentaje.replace('%', '')); setActivo(d.activo); setSugerencias([]); setMostrarSugerencias(false); setEditItem(d); setModal('editar') }
  const cerrarModal = () => { setModal(null); setDeleteId(null) }

  const handleLibroChange = (val) => {
    setLibro(val)
    if (val.trim().length > 0) {
      setSugerencias(LIBROS_DISPONIBLES.filter(t => t.toLowerCase().includes(val.toLowerCase())))
      setMostrarSugerencias(true)
    } else {
      setSugerencias([])
      setMostrarSugerencias(false)
    }
  }

  const seleccionarSugerencia = (titulo) => { setLibro(titulo); setMostrarSugerencias(false) }

  const handleAceptar = () => {
    if (!libro.trim() || !porcentaje.trim()) return
    const porcentajeFormateado = porcentaje.endsWith('%') ? porcentaje.trim() : `${porcentaje.trim()}%`
    if (modal === 'editar' && editItem) {
      setLista(lista.map(g => g.id === editItem.id ? { ...g, libro: libro.trim(), porcentaje: porcentajeFormateado, activo } : g))
    } else {
      const nuevoId = `#DESC-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, libro: libro.trim(), porcentaje: porcentajeFormateado, activo }])
    }
    cerrarModal()
  }

  const handleEliminar = () => { setLista(lista.filter(g => g.id !== deleteId)); cerrarModal() }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título y botón
              (PDF: Exposición de experto - Componentes reutilizables) */}
          <EncabezadoSeccion
            titulo="Gestión de descuentos"
            textBoton="Nuevo Descuento"
            onAccion={abrirCrear}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "LIBRO", "PORCENTAJE", "ESTADO", "ACCIONES"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()
                      (PDF: Renderizado condicional - Listas) */}
                  {paginados.map(descuento => (
                    <tr key={descuento.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">{descuento.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{descuento.libro}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{descuento.porcentaje}</td>
                      <td className="px-6 py-4">
                        {/* RENDERIZADO CONDICIONAL con ternario
                            (PDF: Renderizado condicional - Operador ternario) */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${descuento.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${descuento.activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {descuento.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => abrirEditar(descuento)} className="text-gray-400 hover:text-purple-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteId(descuento.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginados.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">No hay descuentos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="descuentos" onPageChange={setPagina} />
          </div>

          {modal && (
            <ModalFormulario
              titulo={modal === 'editar' ? 'Editar Descuento' : 'Nuevo Descuento'}
              onCerrar={cerrarModal}
              onAceptar={handleAceptar}
              deshabilitado={!libro.trim() || !porcentaje.trim()}
            >
              <div className="relative">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Libro</label>
                <input
                  autoFocus
                  className={inputClass}
                  placeholder="Escribí para buscar libro..."
                  value={libro}
                  onChange={e => handleLibroChange(e.target.value)}
                  onFocus={() => libro.trim().length > 0 && setMostrarSugerencias(true)}
                  onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                />
                {/* RENDERIZADO CONDICIONAL con &&
                    (PDF: Renderizado condicional - Operador &&) */}
                {mostrarSugerencias && sugerencias.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto text-sm divide-y divide-gray-50">
                    {sugerencias.map((opcion, index) => (
                      <li key={index} onClick={() => seleccionarSugerencia(opcion)} className="px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 cursor-pointer">
                        {opcion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Porcentaje de descuento</label>
                <input className={inputClass} placeholder="Ej: 15" value={porcentaje} onChange={e => setPorcentaje(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAceptar()} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Estado del descuento</label>
                <select className={`${inputClass} bg-white`} value={activo} onChange={e => setActivo(e.target.value === 'true')}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </ModalFormulario>
          )}

          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar descuento"
              mensaje="¿Estás seguro de que querés eliminar este descuento? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionDescuentos