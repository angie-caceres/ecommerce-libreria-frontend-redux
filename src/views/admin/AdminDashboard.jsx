// Vista de administrador — Dashboard Principal
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import { BookOpen, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"

import { fetchLibrosAdmin } from "../../redux/librosSlice"
import { fetchUsuarios } from "../../redux/usuariosSlice"
import { fetchPedidos } from "../../redux/ordenSlice"

// TARJETA ESTADÍSTICA 

function StatCard({ icon, label, value, badge, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex justify-between">
        <div>
          <div className="w-8 h-8 rounded-lg bg-[#EBE5F2] text-[#7B5B98] flex items-center justify-center mb-3">
            {icon}
          </div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        {badge && (
          <span className="h-fit text-xs font-bold text-[#877270] bg-[#E5E2DC] px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}


// TABLA DE PEDIDOS RECIENTES

function OrdersTable({ orders, onVerTodo }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Encabezado */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-4xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Pedidos recientes
        </h2>
        <button
          onClick={onVerTodo}
          className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded hover:bg-gray-100"
        >
          VER TODO
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#EBE5F2]">
            <tr>
              {["ID", "CLIENTE", "PRODUCTOS", "TOTAL", "ESTADO"].map((h) => (
                <th key={h} className="text-left text-xs font-bold text-[#7B5B98] uppercase tracking-widest px-8 py-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((pedido) => {
              // Generar iniciales dinámicas idéntico a tu vista VerPedidos
              const iniciales = pedido.nombreUsuario
                ? pedido.nombreUsuario
                    .split(" ")
                    .map((nombre) => nombre[0])
                    .join("")
                    .toUpperCase()
                : "U";

              return (
                <tr key={pedido.idOrden} className="hover:bg-purple-50/40 transition-colors">
                  {/* ID */}
                  <td className="px-8 py-5 text-xs text-gray-500 font-mono">
                    #{pedido.idOrden}
                  </td>

                  {/* Cliente */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#CBAAE9] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {iniciales}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{pedido.nombreUsuario}</p>
                        <p className="text-xs text-gray-400">{pedido.emailUsuario}</p>
                      </div>
                    </div>
                  </td>

                  {/* Productos */}
                  <td className="px-8 py-5 text-sm text-gray-600">
                    {pedido.productos}
                  </td>

                  {/* Total */}
                  <td className="px-8 py-5">
                    <span className="text-xs text-gray-400 font-medium block">ARS</span>
                    <span className="text-sm font-bold text-gray-800">{pedido.total}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-8 py-5">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        pedido.estado === "CONFIRMADA"
                          ? "text-emerald-600"
                          : pedido.estado === "CANCELADA"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-gray-400 text-sm">
                  No hay pedidos recientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// COMPONENTE PRINCIPAL

export default function AdminDashboard() {
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const {
      itemsAdmin: libros,
      loading: loadingLibros, 
      statusAdmin: statusLibros
  } = useSelector(state => state.libros)

  const {
      items: usuarios,
      loading: loadingUsuarios,
      status: statusUsuarios
  } = useSelector(state => state.usuarios)

  const {
      todos: pedidos,
      loading: loadingPedidos,
      statusAdmin: statusPedidos
  } = useSelector(state => state.orden)

  
  useEffect(() => {
      if (statusLibros === "idle") {
          dispatch(fetchLibrosAdmin())
      }
     
      if (statusUsuarios === "idle") {
          dispatch(fetchUsuarios())
      }

      if (statusPedidos === "idle") {
          dispatch(fetchPedidos())
      }
  }, [dispatch, statusLibros, statusUsuarios, statusPedidos])

  const loading =
    loadingLibros ||
    loadingUsuarios ||
    loadingPedidos

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef] font-serif text-gray-500">
        Cargando resumen del panel...
      </div>
    );
  }

  const totalLibros = libros.length

  const totalUsuarios = usuarios.length

  const pedidosRecientes = [...pedidos]
      .sort((a, b) => b.idOrden - a.idOrden)
      .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex font-serif">
      {/* Menú lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 ml-56">
        {/* Barra superior */}
        <HeaderAdmin />

        {/* Contenido del dashboard */}
        <main className="p-10 max-w-6xl mx-auto space-y-12">
          <h2 className="text-4xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Resumen
          </h2>

          {/* Tarjetas estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0">
            <StatCard
              icon={<BookOpen size={16} />}
              label="Total Libros"
              value={totalLibros.toLocaleString("es-AR")}
              onClick={() => navigate("/admin/libros")}
            />

            <StatCard
              icon={<Users size={16} />}
              label="Usuarios Totales"
              value={totalUsuarios.toLocaleString("es-AR")}
              onClick={() => navigate("/admin/usuarios")}
            />
          </div>

          {/* Tabla de pedidos reales adaptada */}
          <OrdersTable
            orders={pedidosRecientes}
            onVerTodo={() => navigate("/admin/pedidos")}
          />
        </main>
      </div>
    </div>
  );
}