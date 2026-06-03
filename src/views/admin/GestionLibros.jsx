// VISTA — gestión de libros del panel admin
import { useState } from 'react'
import { Trash2, Pencil, X } from 'lucide-react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalConfirmacion from "../../components/ModalConfirmacion"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"
import { useNavigate } from "react-router-dom"

const librosIniciales = [
  { id: 1,  titulo: 'Amanecer en la cosecha',     autor: 'Suzanne Collins',           genero: 'Distopía',  precioOriginal: 40000, descuento: '-10%', imagen: '/libros/juegos.png'       },
  { id: 2,  titulo: '1984',                        autor: 'George Orwell',             genero: 'Distopía',  precioOriginal: 18000, descuento: '0%',   imagen: '/libros/1984.jpg'         },
  { id: 3,  titulo: 'El Hobbit',                   autor: 'J.R.R. Tolkien',            genero: 'Fantasía',  precioOriginal: 25000, descuento: '0%',   imagen: '/libros/hobbit.jpg'       },
  { id: 4,  titulo: 'Drácula',                     autor: 'Bram Stoker',               genero: 'Terror',    precioOriginal: 22000, descuento: '0%',   imagen: '/libros/dracula.jpg'      },
  { id: 5,  titulo: 'Crimen y Castigo',            autor: 'Fiódor Dostoyevski',        genero: 'Clásico',   precioOriginal: 28000, descuento: '0%',   imagen: '/libros/crimen.jpg'       },
  { id: 6,  titulo: 'Orgullo y Prejuicio',         autor: 'Jane Austen',               genero: 'Romance',   precioOriginal: 21000, descuento: '0%',   imagen: '/libros/orgullo.jpg'      },
  { id: 7,  titulo: 'Fahrenheit 451',              autor: 'Ray Bradbury',              genero: 'Distopía',  precioOriginal: 19000, descuento: '0%',   imagen: '/libros/fahrenheit.jpg'   },
  { id: 8,  titulo: 'El Nombre del Viento',        autor: 'Patrick Rothfuss',          genero: 'Fantasía',  precioOriginal: 38000, descuento: '0%',   imagen: '/libros/nombre-viento.jpg'},
  { id: 9,  titulo: 'It',                          autor: 'Stephen King',              genero: 'Terror',    precioOriginal: 45000, descuento: '0%',   imagen: '/libros/it.jpg'           },
  { id: 10, titulo: 'El Principito',               autor: 'Antoine de Saint-Exupéry', genero: 'Infantil',  precioOriginal: 12000, descuento: '0%',   imagen: '/libros/principito.jpg'   },
  { id: 11, titulo: 'La República',                autor: 'Platón',                    genero: 'Filosofía', precioOriginal: 26000, descuento: '0%',   imagen: '/libros/republica.jpg'    },
  { id: 12, titulo: 'Más allá del bien y del mal', autor: 'Friedrich Nietzsche',       genero: 'Filosofía', precioOriginal: 24000, descuento: '0%',   imagen: '/libros/nietzsche.jpg'    },
]

const GENERO_COLORES = {
  'Distopía':  'bg-purple-100 text-purple-700',
  'Fantasía':  'bg-blue-100 text-blue-700',
  'Terror':    'bg-red-100 text-red-700',
  'Clásico':   'bg-yellow-100 text-yellow-700',
  'Romance':   'bg-pink-100 text-pink-700',
  'Infantil':  'bg-green-100 text-green-700',
  'Filosofía': 'bg-orange-100 text-orange-700',
}

const POR_PAGINA = 9

function GestionLibros() {

  const navigate = useNavigate()

  // HOOK useState — estados locales del componente
  const [lista, setLista]       = useState(librosIniciales)
  const [pagina, setPagina]     = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const paginados = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const cerrarModal = () => setDeleteId(null)

  // EVENTO — elimina un libro
  const handleEliminar = () => {
    setLista(lista.filter(l => l.id !== deleteId))
    cerrarModal()
  }

  const getPrecio = (libro) => {
    if (libro.descuento && libro.descuento !== '0%') {
      const porcentaje = parseInt(libro.descuento)
      const final = libro.precioOriginal * (1 + porcentaje / 100)
      return `$${final.toLocaleString()} (${libro.descuento})`
    }
    return `$${libro.precioOriginal.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título y botón  */}
          <EncabezadoSeccion
            titulo="Gestión de libros"
            textBoton="Nuevo Libro"
            onAccion={() => navigate("/admin/libros/crear")}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['ID', 'TÍTULO', 'AUTOR', 'GÉNERO', 'PRECIO', 'ACCIONES'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()  */}
                  {paginados.map(libro => (
                    <tr key={libro.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">#{libro.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{libro.titulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{libro.autor}</td>
                      <td className="px-6 py-4">
                        {/* RENDERIZADO CONDICIONAL con ternario  */}
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${GENERO_COLORES[libro.genero] ?? 'bg-gray-100 text-gray-600'}`}>
                          {libro.genero}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{getPrecio(libro)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => navigate(`/admin/libros/editar/${libro.id}`)} className="text-gray-400 hover:text-purple-600 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(libro.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginados.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">No hay libros registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagina} totalPages={totalPaginas} totalItems={lista.length} itemsPerPage={POR_PAGINA} itemLabel="libros" onPageChange={setPagina} />
          </div>

          {/* RENDERIZADO CONDICIONAL con &&  */}
          {deleteId && (
            <ModalConfirmacion
              titulo="Eliminar libro"
              mensaje="¿Estás seguro de que querés eliminar este libro? Esta acción no se puede deshacer."
              onCancelar={cerrarModal}
              onConfirmar={handleEliminar}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default GestionLibros