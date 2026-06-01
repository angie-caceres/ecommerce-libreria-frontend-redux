import { useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";

const TODOS_LOS_PEDIDOS = [
  { id: "#ORD-8821", num: 1,  cliente: "Usuario #8821", productos: "Don Quijote de la Mancha, +2 más",      total: "1.240,00",  status: "CONFIRMADO" },
  { id: "#ORD-8819", num: 2,  cliente: "Usuario #8819", productos: "Rayuela (Edición Conmemorativa)",        total: "45.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8815", num: 3,  cliente: "Usuario #8815", productos: "La Divina Comedia (Ilustrado)",          total: "32.000,00", status: "PENDIENTE"  },
  { id: "#ORD-8812", num: 4,  cliente: "Usuario #8812", productos: "Cien Años de Soledad (Ed. Especial)",    total: "89.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8810", num: 5,  cliente: "Usuario #8810", productos: "Ficciones - Jorge Luis Borges",          total: "11.250,00", status: "PENDIENTE"  },
  { id: "#ORD-8808", num: 6,  cliente: "Usuario #8808", productos: "El Aleph",                               total: "15.600,00", status: "CONFIRMADO" },
  { id: "#ORD-8805", num: 7,  cliente: "Usuario #8805", productos: "Crónica de una muerte anunciada",        total: "12.000,00", status: "PENDIENTE"  },
  { id: "#ORD-8801", num: 8,  cliente: "Usuario #8801", productos: "Pedro Páramo",                           total: "9.800,00",  status: "CONFIRMADO" },
  { id: "#ORD-8798", num: 9,  cliente: "Usuario #8798", productos: "Antología Poética - Neruda",             total: "22.400,00", status: "CONFIRMADO" },
  { id: "#ORD-8795", num: 10, cliente: "Usuario #8795", productos: "La tregua - Mario Benedetti",            total: "18.000,00", status: "PENDIENTE"  },
  { id: "#ORD-8792", num: 11, cliente: "Usuario #8792", productos: "2666 - Roberto Bolaño",                  total: "65.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8790", num: 12, cliente: "Usuario #8790", productos: "Historias de cronopios y de famas",      total: "14.500,00", status: "PENDIENTE"  },
  { id: "#ORD-8788", num: 13, cliente: "Usuario #8788", productos: "El laberinto de la soledad",             total: "19.200,00", status: "CONFIRMADO" },
  { id: "#ORD-8785", num: 14, cliente: "Usuario #8785", productos: "Los detectives salvajes",                total: "48.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8782", num: 15, cliente: "Usuario #8782", productos: "Bestiario - Cortázar",                   total: "16.300,00", status: "PENDIENTE"  },
  { id: "#ORD-8779", num: 16, cliente: "Usuario #8779", productos: "El túnel - Sabato",                      total: "21.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8776", num: 17, cliente: "Usuario #8776", productos: "Sobre héroes y tumbas",                  total: "33.500,00", status: "PENDIENTE"  },
  { id: "#ORD-8773", num: 18, cliente: "Usuario #8773", productos: "La ciudad y los perros",                 total: "27.800,00", status: "CONFIRMADO" },
  { id: "#ORD-8770", num: 19, cliente: "Usuario #8770", productos: "Conversación en La Catedral",            total: "41.200,00", status: "CONFIRMADO" },
  { id: "#ORD-8767", num: 20, cliente: "Usuario #8767", productos: "El siglo de las luces",                  total: "13.600,00", status: "PENDIENTE"  },
  { id: "#ORD-8764", num: 21, cliente: "Usuario #8764", productos: "Los ríos profundos",                     total: "9.500,00",  status: "CONFIRMADO" },
  { id: "#ORD-8761", num: 22, cliente: "Usuario #8761", productos: "El obsceno pájaro de la noche",          total: "18.900,00", status: "PENDIENTE"  },
  { id: "#ORD-8758", num: 23, cliente: "Usuario #8758", productos: "Boquitas pintadas",                      total: "12.300,00", status: "CONFIRMADO" },
  { id: "#ORD-8755", num: 24, cliente: "Usuario #8755", productos: "Terra Nostra",                           total: "56.000,00", status: "CONFIRMADO" },
  { id: "#ORD-8752", num: 25, cliente: "Usuario #8752", productos: "El otoño del patriarca",                 total: "24.700,00", status: "PENDIENTE"  },
];

const ITEMS_POR_PAGINA = 15;

const AVATAR_COLORS = [
  "#7C3AED","#059669","#DC2626","#D97706","#0891B2",
  "#BE185D","#15803D","#1D4ED8","#9333EA","#EA580C",
  "#0D9488","#B45309","#4F46E5","#DB2777","#16A34A",
];

{/*
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    // Si hay pocas páginas, mostrar todas
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3)           pages.push("...");
    if (currentPage > 2)           pages.push(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
    if (currentPage < totalPages - 1) pages.push(currentPage + 1);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return [...new Set(pages)]; // elimina duplicados
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 flex-wrap gap-3">
      <p className="text-xs text-gray-400">
        Mostrando {(currentPage - 1) * ITEMS_POR_PAGINA + 1} a{" "}
        {Math.min(currentPage * ITEMS_POR_PAGINA, TODOS_LOS_PEDIDOS.length)} de{" "}
        {TODOS_LOS_PEDIDOS.length} resultados
      </p>

      {/* Controles de paginación */} 

{/*      <div className="flex items-center gap-1">
        {/* Botón anterior */}
{/*        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors
            ${currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 cursor-pointer"}`}
        >‹</button>

        {getPages().map((page, index) => (
          <button
            key={`${page}-${index}`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${page === currentPage
                ? "bg-purple-600 text-white shadow-sm"          // página activa
                : page === "..."
                  ? "text-gray-400 cursor-default"              // separador
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"}`}
          >
            {page}
          </button>
        ))}

        {/* Botón siguiente */}
{/*        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors
            ${currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 cursor-pointer"}`}
        >›</button>
      </div>
    </div>
  );
}
*/}
// ─────────────────────────────────────────────────────────────
// PRINCIPAL: TodosLosPedidos
// ─────────────────────────────────────────────────────────────
export default function VerPedidos() {

  // Página actual de la tabla (paginación)
  const [currentPage, setCurrentPage] = useState(1);

  // Filtro de estado del pedido
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  
  const pedidosFiltrados = TODOS_LOS_PEDIDOS.filter(
    p => filtroEstado === "TODOS" || p.status === filtroEstado
  );

  // Total de páginas calculado sobre los resultados filtrados
  const totalPages = Math.max(1, Math.ceil(pedidosFiltrados.length / ITEMS_POR_PAGINA));

  const pedidosPagina = pedidosFiltrados.slice(
    (currentPage - 1) * ITEMS_POR_PAGINA,
    currentPage * ITEMS_POR_PAGINA
  );

  // Al cambiar filtro o búsqueda, volver a la página 1
  const handleFiltro = (estado) => {
    setFiltroEstado(estado);
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-[#f7f4ef] font-sans">

      <Sidebar />

      {/* ── CONTENIDO PRINCIPAL ──────────────────────────── */}
      <div className="ml-56 min-h-screen flex flex-col">

        <HeaderAdmin />

        {/* CUERPO */}
        <main className="flex-1 p-8 space-y-6">

          {/* Encabezado */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Todos los Pedidos</h2>
            <p className="text-sm text-gray-400 mt-1">Gestión de todos los pedidos</p>
          </div>

          {/* ── TABLA PRINCIPAL ──────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">

              {/* Filtros de estado */}
              <div className="flex gap-2 flex-wrap">
                {["TODOS", "CONFIRMADO", "PENDIENTE"].map(f => (
                  <button key={f}
                    onClick={() => handleFiltro(f)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      filtroEstado === f
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}>
                    {f === "TODOS" ? "Todos" : f === "CONFIRMADO" ? "Confirmados" : "Pendientes"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-100">
                    {["ID DE PEDIDO", "CLIENTE", "PRODUCTOS", "TOTAL", "ESTADO"].map(h => (
                      <th key={h}
                        className="text-left text-xs font-bold text-purple-700 uppercase tracking-wider px-6 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">

                  {pedidosPagina.map((pedido) => (
                    <tr key={pedido.id}
                      className="hover:bg-purple-50/40 transition-colors">

                      {/* ID del pedido */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-700">{pedido.id}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: AVATAR_COLORS[(pedido.num - 1) % AVATAR_COLORS.length] }}>
                            {pedido.num <= 9 ? `U${pedido.num}` : pedido.num}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{pedido.cliente.split(" ")[0]}</p>
                            <p className="text-xs text-gray-400">{pedido.cliente.split(" ")[1]}</p>
                          </div>
                        </div>
                      </td>

                      {/* Productos */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{pedido.productos}</span>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">ARS</p>
                          <p className="text-sm font-bold text-gray-800">{pedido.total}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold tracking-wide ${
                          pedido.status === "CONFIRMADO"
                            ? "text-emerald-600"
                            : "text-amber-500"
                        }`}>
                          {pedido.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {pedidosPagina.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No se encontraron pedidos para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pedidosFiltrados.length}
              itemsPerPage={ITEMS_POR_PAGINA}
              itemLabel="pedidos"
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
            />
          </div>

        </main>
      </div>
    </div>
  );
}