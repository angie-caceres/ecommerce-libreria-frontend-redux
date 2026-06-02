// COMPONENTE — Vista de gestión de descuentos del panel de administrador
import { useState } from 'react'
import { Trash2, Plus, X, Pencil } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";

// DATOS DE PRUEBA
export const descuentosIniciales = [
  { id: '#DESC-1', libro: 'Harry Potter y la piedra filosofal', porcentaje:'20%', activo: true  },
  { id: '#DESC-2', libro: 'Los juegos del hambre', porcentaje:'5%', activo: true  },
  { id: '#DESC-3', libro: 'Rayuela', porcentaje:'10%', activo: true  },
  { id: '#DESC-4', libro: 'Submarino', porcentaje:'10%', activo: true  },
  { id: '#DESC-5', libro: 'Sherlock Holmes: Estudio en escarlata', porcentaje:'15%', activo: true  },
  { id: '#DESC-6', libro: 'Lobo estepario', porcentaje:'30%', activo: true  },
  { id: '#DESC-7', libro: 'El laberinto de la soledad', porcentaje:'20%', activo: true  },
  { id: '#DESC-8', libro: 'Caperucita Roja', porcentaje:'10%', activo: true  },
  { id: '#DESC-9', libro: 'Floricienta: El cuento original', porcentaje:'20%', activo: true  },
]

const LIBROS_DISPONIBLES = [
  'Harry Potter y la piedra filosofal',
  'Harry Potter y la cámara secreta',
  'Los juegos del hambre',
  'En llamas',
  'Sinsajo',
  'Rayuela',
  'Submarino',
  'Sherlock Holmes: Estudio en escarlata',
  'El sabueso de los Baskerville',
  'Lobo estepario',
  'El laberinto de la soledad',
  'Caperucita Roja',
  'Floricienta: El cuento original',
  'Cien años de soledad',
  'Ficciones'
]

const POR_PAGINA = 9

function GestionDescuentos() {

  // ESTADOS — Control de la lista, paginación y modales
  const [lista, setLista]       = useState(descuentosIniciales)
  const [pagina, setPagina]     = useState(1)
  const [modal, setModal]       = useState(null)   // null | 'crear' | 'editar'
  const [editItem, setEditItem] = useState(null)   
  const [deleteId, setDeleteId] = useState(null)   

  // ESTADOS DEL FORMULARIO
  const [libro, setLibro]           = useState('')
  const [porcentaje, setPorcentaje] = useState('')
  const [activo, setActivo]         = useState(true)

  // ESTADOS PARA EL AUTOCOMPLETADO
  const [sugerencias, setSugerencias]               = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  // PAGINACIÓN — calcula qué items mostrar según la página actual
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // HANDLERS — funciones que manejan eventos de la UI
  const abrirCrear = () => {
    setLibro('')
    setPorcentaje('')
    setActivo(true)
    setSugerencias([])
    setMostrarSugerencias(false)
    setEditItem(null)
    setModal('crear')
  }

  const abrirEditar = (descuento) => {
    setLibro(descuento.libro)
    setPorcentaje(descuento.porcentaje.replace('%', ''))
    setActivo(descuento.activo)
    setSugerencias([])
    setMostrarSugerencias(false)
    setEditItem(descuento)
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(null)
    setDeleteId(null)
  }

  const handleLibroChange = (val) => {
    setLibro(val)
    if (val.trim().length > 0) {
      const filtrados = LIBROS_DISPONIBLES.filter(titulo =>
        titulo.toLowerCase().includes(val.toLowerCase())
      )
      setSugerencias(filtrados)
      setMostrarSugerencias(true)
    } else {
      setSugerencias([])
      setMostrarSugerencias(false)
    }
  }

  const seleccionarSugerencia = (titulo) => {
    setLibro(titulo)
    setMostrarSugerencias(false)
  }

  const handleAceptar = () => {
    if (!libro.trim() || !porcentaje.trim()) return

    const porcentajeFormateado = porcentaje.endsWith('%') ? porcentaje.trim() : `${porcentaje.trim()}%`

    if (modal === 'editar' && editItem) {
      setLista(lista.map(g =>
        g.id === editItem.id ? { ...g, libro: libro.trim(), porcentaje: porcentajeFormateado, activo: activo} : g
      ))
    } else {
      const nuevoId = `#DESC-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, libro: libro.trim(), porcentaje: porcentajeFormateado, activo: activo}])
    }
    cerrarModal()
  }

  const handleEliminar = () => {
    setLista(lista.filter(g => g.id !== deleteId))
    cerrarModal()
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">

      {/* Menú lateral */}
      <Sidebar />

      {/* Columna principal — El margen ml-56 previene que la sidebar pise el contenido */}
      <div className="ml-56 min-h-screen flex flex-col">

        {/* Encabezado */}
        <HeaderAdmin />

        {/* Contenido principal */}
        <main className="flex-1 p-8 space-y-6">

          {/* Bloque superior con Título y Botón de Acción integrado al estilo header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2
                className="text-4xl text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Gestión de descuentos
              </h2>
            </div>
            <div>
             <button
              onClick={abrirCrear}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity bg-[#CBAAE9] shadow-sm uppercase tracking-wider"
            >
                <Plus size={14} />
                Nuevo Descuento
              </button>
            </div>
          </div>

          {/* CONTENEDOR DE LA TABLA */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "LIBRO", "PORCENTAJE", "ESTADO", "ACCIONES"].map((h) => (
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
                  {paginados.map((descuento) => (
                    <tr 
                      key={descuento.id} 
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        {descuento.id}
                      </td>

                      {/* Libro asignado */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#7B5B98] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">
                            {descuento.libro}
                          </span>
                        </div>
                      </td>

                      {/* Porcentaje */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {descuento.porcentaje}
                      </td>

                      {/* Estado Rediseñado estilo GestiónUsuarios */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          descuento.activo 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${descuento.activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {descuento.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => abrirEditar(descuento)} 
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(descuento.id)} 
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
                      <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No hay descuentos registrados en este momento.
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
              itemLabel="descuentos"
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
                    {modal === 'editar' ? 'Editar Descuento' : 'Nuevo Descuento'}
                  </span>
                  <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* INPUT LIBRO CON SUGERENCIAS */}
                  <div className="relative">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Libro
                    </label>
                    <input
                      autoFocus
                      className="w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Escribí para buscar libro..."
                      value={libro}
                      onChange={e => handleLibroChange(e.target.value)}
                      onFocus={() => libro.trim().length > 0 && setMostrarSugerencias(true)}
                      onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                    />

                    {/* SUGERENCIAS DESPLEGABLES */}
                    {mostrarSugerencias && sugerencias.length > 0 && (
                      <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto text-sm divide-y divide-gray-50">
                        {sugerencias.map((opcion, index) => (
                          <li 
                            key={index}
                            onClick={() => seleccionarSugerencia(opcion)}
                            className="px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 cursor-pointer transition-colors text-left font-medium"
                          >
                            {opcion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* PORCENTAJE DE DESCUENTO */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Porcentaje de descuento
                    </label>
                    <input
                      className="w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Ej: 15"
                      value={porcentaje}
                      onChange={e => setPorcentaje(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAceptar()}
                    />
                  </div>

                  {/* SELECT ESTADO */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Estado del Descuento
                    </label>
                    <select
                      className="w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-purple-100"
                      value={activo}
                      onChange={e => setActivo(e.target.value === 'true')}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={cerrarModal} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wider">
                      CANCELAR
                    </button>
                    <button
                      onClick={handleAceptar}
                      disabled={!libro.trim() || !porcentaje.trim()}
                      className="px-5 py-2 rounded-lg text-white text-xs font-semibold uppercase hover:opacity-90 disabled:opacity-40 transition-opacity bg-[#2d2660]"
                    >
                      ACEPTAR
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Modal confirmación de borrado */}
          {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={cerrarModal} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-800">Eliminar descuento</span>
                  <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-5">
                  ¿Estás seguro de que querés eliminar este descuento? Esta acción no se puede deshacer.
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
export default GestionDescuentos