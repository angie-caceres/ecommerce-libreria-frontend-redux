// VISTA — gestión de pedidos del panel admin
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import FiltrosBotones from "../../components/FiltrosBotones"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const TODOS_LOS_PEDIDOS = [
  { id: "#ORD-8821", num: 1,  cliente: "Usuario #8821", productos: "Don Quijote de la Mancha, +2 más",   total: "1.240,00",  status: "CONFIRMADO" },
  { id: "#ORD-8819", num: 2,  cliente: "Usuario #8819", productos: "Rayuela (Edición Conmemorativa)",     total: "45.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8815", num: 3,  cliente: "Usuario #8815", productos: "La Divina Comedia (Ilustrado)",       total: "32.000,00", status: "PENDIENTE"  },
  { id: "#ORD-8812", num: 4,  cliente: "Usuario #8812", productos: "Cien Años de Soledad (Ed. Especial)", total: "89.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8810", num: 5,  cliente: "Usuario #8810", productos: "Ficciones - Jorge Luis Borges",       total: "11.250,00", status: "PENDIENTE"  },
  { id: "#ORD-8808", num: 6,  cliente: "Usuario #8808", productos: "El Aleph",                            total: "15.600,00", status: "CONFIRMADO" },
  { id: "#ORD-8805", num: 7,  cliente: "Usuario #8805", productos: "Crónica de una muerte anunciada",     total: "12.000,00", status: "PENDIENTE"  },
  { id: "#ORD-8801", num: 8,  cliente: "Usuario #8801", productos: "Pedro Páramo",                        total: "9.800,00",  status: "CONFIRMADO" },
  { id: "#ORD-8798", num: 9,  cliente: "Usuario #8798", productos: "Antología Poética - Neruda",          total: "22.400,00", status: "CONFIRMADO" },
  { id: "#ORD-8795", num: 10, cliente: "Usuario #8795", productos: "La tregua - Mario Benedetti",         total: "18.000,00", status: "PENDIENTE"  },
]

const ITEMS_POR_PAGINA = 15
const AVATAR_COLORS = ["#CBAAE9"]

export default function VerPedidos() {

  // HOOK useState — estados locales del componente
  // (PDF: Estados locales y props - useState)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState("TODOS")

  const pedidosFiltrados = TODOS_LOS_PEDIDOS.filter(p => filtroEstado === "TODOS" || p.status === filtroEstado)
  const totalPages = Math.max(1, Math.ceil(pedidosFiltrados.length / ITEMS_POR_PAGINA))
  const pedidosPagina = pedidosFiltrados.slice((currentPage - 1) * ITEMS_POR_PAGINA, currentPage * ITEMS_POR_PAGINA)

  const handleFiltro = (estado) => { setFiltroEstado(estado); setCurrentPage(1) }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título sin botón
              (PDF: Exposición de experto - Componentes reutilizables) */}
          <EncabezadoSeccion titulo="Todos los pedidos" />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              {/* COMPONENTE reutilizable — botones de filtro
                  (PDF: Exposición de experto - Componentes reutilizables) */}
              <FiltrosBotones
                opciones={["TODOS", "CONFIRMADO", "PENDIENTE"]}
                activo={filtroEstado}
                onChange={handleFiltro}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#EBE5F2]">
                    {["ID DE PEDIDO", "CLIENTE", "PRODUCTOS", "TOTAL", "ESTADO"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-[#473954] uppercase tracking-wider px-6 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()
                      (PDF: Renderizado condicional - Listas) */}
                  {pedidosPagina.map(pedido => (
                    <tr key={pedido.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-4"><span className="text-sm font-bold text-gray-700">{pedido.id}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: AVATAR_COLORS[0] }}>
                            {pedido.num <= 9 ? `U${pedido.num}` : pedido.num}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{pedido.cliente.split(" ")[0]}</p>
                            <p className="text-xs text-gray-400">{pedido.cliente.split(" ")[1]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm text-gray-600">{pedido.productos}</span></td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-400 font-medium">ARS</p>
                        <p className="text-sm font-bold text-gray-800">{pedido.total}</p>
                      </td>
                      <td className="px-6 py-4">
                        {/* RENDERIZADO CONDICIONAL con ternario
                            (PDF: Renderizado condicional - Operador ternario) */}
                        <span className={`text-xs font-bold tracking-wide ${pedido.status === "CONFIRMADO" ? "text-emerald-600" : "text-amber-500"}`}>
                          {pedido.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pedidosPagina.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">No se encontraron pedidos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={pedidosFiltrados.length} itemsPerPage={ITEMS_POR_PAGINA} itemLabel="pedidos" onPageChange={page => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }} />
          </div>

        </main>
      </div>
    </div>
  )
}