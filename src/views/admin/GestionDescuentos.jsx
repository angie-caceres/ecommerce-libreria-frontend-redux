// COMPONENTE — Vista de gestión de géneros del panel de administrador
import { useState } from 'react'
import { Edit2, Trash2, Plus, X, Pencil } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";

// DATOS DE PRUEBA — reemplazá esto por una llamada a tu API
const descuentosIniciales = [
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

  // ESTADOS — cada uno controla una parte de la UI
  // (PDF: Estados locales y props - Estado)
  const [lista, setLista]       = useState(descuentosIniciales)
  const [pagina, setPagina]     = useState(1)
  const [modal, setModal]       = useState(null)   // null | 'crear' | 'editar'
  const [editItem, setEditItem] = useState(null)   // género que se está editando
  const [deleteId, setDeleteId] = useState(null)   // id del género a eliminar

  // ESTADOS DEL FORMULARIO (Inputs individuales)
  const [libro, setLibro]       = useState('')
  const [porcentaje, setPorcentaje] = useState('')
  const [activo, setActivo]     = useState(true)

  //ESTADOS PARA EL AUTOCOMPLETADO
  const [sugerencias, setSugerencias] = useState([])
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
    // Limpiamos el símbolo '%' para editar solo el número limpiamente
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

  // 💡 FUNCIÓN PARA MANEJAR EL CAMBIO EN EL INPUT DEL LIBRO
  const handleLibroChange = (val) => {
    setLibro(val)
    
    if (val.trim().length > 0) {
      // Filtramos las opciones que contengan la cadena escrita (ignorando mayúsculas)
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

  // 💡 FUNCIÓN AL HACER CLIC EN UNA COINCIDENCIA
  const seleccionarSugerencia = (titulo) => {
    setLibro(titulo)
    setMostrarSugerencias(false)
  }

  // Crea o edita un género según el modal abierto
  const handleAceptar = () => {
    if (!libro.trim() || !porcentaje.trim()) return

    // Formateamos el porcentaje para que guarde siempre con el símbolo '%'
    const porcentajeFormateado = porcentaje.endsWith('%') ? porcentaje.trim() : `${porcentaje.trim()}%`

    if (modal === 'editar' && editItem) {
      // EDITAR — reemplaza el género con el mismo id
      setLista(lista.map(g =>
        g.id === editItem.id ? { ...g, libro: libro.trim(), porcentaje: porcentajeFormateado, activo: activo} : g
      ))
    } else {
      // CREAR — agrega un nuevo género al array
      const nuevoId = `#DESC-${lista.length + 1}`
      setLista([...lista, { id: nuevoId, libro: libro.trim(), porcentaje: porcentajeFormateado, activo: activo}])
    }

    cerrarModal()
  }

  // ELIMINAR — filtra el array quitando el género con ese id
  const handleEliminar = () => {
    setLista(lista.filter(g => g.id !== deleteId))
    cerrarModal()
  }

  return (
    // LAYOUT — Sidebar fija a la izquierda, contenido a la derecha
    <div className="flex min-h-screen bg-[#f5f2ec]">

      {/* COMPONENTE Sidebar — navegación lateral */}
      <Sidebar />

      {/* Columna principal */}
      <div className="flex-1 flex flex-col ml-44">

        {/* COMPONENTE HeaderAdmin — barra superior */}
        <HeaderAdmin />

        {/* Contenido de la página */}
        <main className="flex-1 p-6 space-y-5 mt-14">

          <h1 className="text-2xl font-bold text-gray-800">Gestión de Descuentos</h1>

          {/* Tabla principal */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Botón nuevo género */}
            <div className="flex justify-end px-5 py-4 border-b border-gray-100">
              <button
                onClick={abrirCrear}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity bg-[#2d2660]"
              >
                <Plus size={14} />
                NUEVO DESCUENTO
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="px-5 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Libro</th>
                    <th className="px-4 py-3 text-left">Porcentaje</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* RENDERIZADO DE LISTA con .map() */}
                  {paginados.map((descuento) => (
                    <tr key={descuento.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">

                      <td className="px-5 py-3 text-xs text-gray-500 font-mono">{descuento.id}</td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                          <span className="text-xs text-gray-800 font-medium">{descuento.libro}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">{descuento.porcentaje}</td>

                      {/* COLUMNA ESTADO (ACTIVO/INACTIVO) */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          descuento.activo 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${descuento.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {descuento.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* EVENTO onClick — abre el modal de editar con los datos del género */}
                          <button onClick={() => abrirEditar(descuento)} className="text-gray-400 hover:text-purple-600 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(descuento.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* COMPONENTE Pagination — recibe los datos necesarios como props */}
            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              totalItems={lista.length}
              itemsPerPage={POR_PAGINA}
              itemLabel="descuentos"
              onPageChange={setPagina}
            />

          </div>

          {/* Modal crear / editar
              RENDERIZADO CONDICIONAL con && */}
          {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-[#2d1f5e]/70" onClick={cerrarModal} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">

                <div className="flex items-center justify-between mb-5">
                  {/* OPERADOR TERNARIO — título cambia según si es crear o editar */}
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
                      // Agregamos un leve delay al desenfocar para permitir el click en la lista
                      onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                    />

                    {/* CAJA DE COINCIDENCIAS DESPLEGABLE */}
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
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Porcentaje de descuento
                    </label>
                    <input
                      autoFocus
                      className="w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Ej: 15"
                      value={porcentaje}
                      onChange={e => setPorcentaje(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAceptar()}
                    />
                  </div>
                  {/* SELECT ESTADO (ACTIVO / INACTIVO) */}
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

                  <div className="flex justify-end gap-3">
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

          {/* Modal confirmación de borrado
              RENDERIZADO CONDICIONAL con && */}
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