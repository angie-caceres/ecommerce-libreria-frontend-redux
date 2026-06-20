//Vista de administrador dashboard 
//Hook de React (actualmente no se utiliza en el código)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import { BookOpen, Users } from "lucide-react";

// ===============================
// DATOS DE PRUEBA
// ===============================
// Información utilizada para generar el gráfico de ventas semanales
const WEEKLY_SALES = [
  { day: "L", amount: 18500 },
  { day: "M", amount: 32000 },
  { day: "M", amount: 21000 },
  { day: "J", amount: 48000 },
  { day: "V", amount: 39000 },
  { day: "S", amount: 43000 },
  { day: "D", amount: 27000 },
];

// Información utilizada para la tabla de pedidos recientes
const RECENT_ORDERS = [
  { id: "#ORD-7742", user: "Elena H.", initials: "EH", total: "ARS 142.000,50", status: "Confirmado", date: "24 Abr, 2026" },
  { id: "#ORD-7741", user: "Julian M.", initials: "JM", total: "ARS 85.000,00", status: "Pendiente", date: "1 May, 2026" },
  { id: "#ORD-7740", user: "Sarah C.", initials: "SC", total: "ARS 21.000,00", status: "Confirmado", date: "15 May, 2026" },
  { id: "#ORD-7739", user: "Richard A.", initials: "RA", total: "ARS 55.000,20", status: "Pendiente", date: "17 May, 2026" },
  { id: "#ORD-7738", user: "Mateo G.", initials: "MG", total: "ARS 12.400,00", status: "Confirmado", date: "20 May, 2026" },
  { id: "#ORD-7737", user: "Lucía B.", initials: "LB", total: "ARS 33.150,00", status: "Confirmado", date: "22 May, 2026" },
  { id: "#ORD-7736", user: "Facundo P.", initials: "FP", total: "ARS 45.900,00", status: "Pendiente", date: "25 May, 2026" },
  { id: "#ORD-7735", user: "Ana V.", initials: "AV", total: "ARS 102.000,00", status: "Pendiente", date: "28 May, 2026" },
  { id: "#ORD-7734", user: "Omar S.", initials: "OS", total: "ARS 15.000,00", status: "Confirmado", date: "30 May, 2026" },
];

// ===============================
// TARJETA ESTADÍSTICA
// ===============================

// Muestra una tarjeta con un ícono, un título,
// un valor y opcionalmente una etiqueta (badge)
function StatCard({ icon, label, value, badge, onClick }) {
  return (
     <div
        onClick={onClick}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
      >
      <div className="flex justify-between">

        {/* Contenido principal de la tarjeta */}
        <div>
          <div className="w-8 h-8 rounded-lg bg-[#EBE5F2] text-[#7B5B98] flex items-center justify-center mb-3">
            {icon}
          </div>

          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>

        {/* Badge opcional */}
        {badge && (
          <span className="h-fit text-xs font-bold text-[#877270] bg-[#E5E2DC] px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}


// ===============================
// GRÁFICO DE VENTAS
// ===============================

// Genera un gráfico de barras usando los datos recibidos
function SalesChart({ data }) {

  // Obtiene el valor más alto para calcular alturas relativas
  const maxAmount = Math.max(...data.map((d) => d.amount));

  // Suma todas las ventas de la semana
  const totalWeek = data.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">

      {/* Título del gráfico */}
      <h2
          className="text-4xl text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Ventas semanales
        </h2>

      {/* Contenedor de barras */}
      <div className="flex items-end justify-between h-56 px-4">

        {data.map((item, index) => {

          // Altura proporcional al valor máximo
          const heightPct = (item.amount / maxAmount) * 100;

          // Verifica si es la barra con mayor venta
          const isHighest = item.amount === maxAmount;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-full"
            >

              {/* Barra de ventas */}
              <div
                className={`w-12 rounded-t-md ${
                  isHighest
                    ? "bg-[#7B5B98]" //Barra alta
                    : "bg-[#CBAAE9]" //Resto de barras
                }`}
                style={{
                  height: `${heightPct}%`,
                  minHeight: "20px",
                }}
              />

              {/* Inicial del día */}
              <span
                className={`text-xs font-bold mt-3 ${
                  isHighest
                    ? "text-[#7B5B98]"
                    : "text-gray-500"
                }`}
              >
                {item.day}
              </span>

            </div>
          );
        })}

      </div>

      {/* Resumen total */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-end justify-between">

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Total Semana
          </p>

          <p className="text-2xl font-bold text-gray-900">
            ${totalWeek.toLocaleString("es-AR")} ARS
          </p>
        </div>

        {/* Porcentaje de crecimiento */}
        <span className="text-sm font-bold text-[#877270] bg-[#E5E2DC] border border-[#CBC4CE] px-3 py-1 rounded">
          +12%
        </span>

      </div>

    </div>
  );
}


// ===============================
// TABLA DE PEDIDOS
// ===============================

// Muestra la lista de pedidos recientes
function OrdersTable({ orders, onVerTodo }) {

  // Determina el color según el estado del pedido
  const statusStyle = (status) =>
    status === "Confirmado"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Encabezado */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <h2
          className="text-4xl text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Pedidos recientes
        </h2>

        <button
          onClick={onVerTodo}
          className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded hover:bg-gray-100">
          VER TODO
        </button>
      </div>

      {/* Tabla de pedidos */}
      <table className="w-full">

        {/* Encabezados */}
        <thead className="bg-[#EBE5F2]">
          <tr>
            {["ID", "USUARIO", "ROL", "TOTAL", "ESTADO", "FECHA"].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-bold text-[#7B5B98] uppercase tracking-widest px-8 py-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas de pedidos */}
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100">

              {/* ID */}
              <td className="px-8 py-5 text-sm font-bold text-gray-700">
                {order.id}
              </td>

              {/* Usuario */}
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-full bg-[#CBAAE9] flex items-center justify-center text-[#473954] text-xs font-bold">
                    {order.initials}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {order.user}
                  </span>

                </div>
              </td>

              {/* Rol */}
              <td className="px-8 py-5">
                <span className="text-xs font-bold bg-[#EBE5F2] text-[#473954] px-3 py-1 rounded-full">
                  Usuario
                </span>
              </td>

              {/* Total */}
              <td className="px-8 py-5 text-sm font-semibold text-gray-700">
                {order.total}
              </td>

              {/* Estado */}
              <td className="px-8 py-5">
                <span className={`text-xs font-bold px-3 py-1 rounded ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
              </td>

              {/* Fecha */}
              <td className="px-8 py-5 text-sm text-gray-500">
                {order.date}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ===============================
// PRINCIPAL
// ===============================

// Dashboard de administración
export default function AdminDashboard() {
  const navigate = useNavigate();

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

          <h2
            className="text-4xl text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Resumen
          </h2>

          {/* Tarjetas estadísticas */}
          <div className="space-y-6">

            <StatCard
              icon={<BookOpen size={16} />}
              label="Total Libros"
              value="1,240"
              onClick={() => navigate("/admin/libros")}
            />

            <StatCard
              icon={<Users size={16} />}
              label="Usuarios Totales"
              value="420"
              badge="+28 nuevos"
              onClick={() => navigate("/admin/usuarios")}
            />

          </div>

          {/* Gráfico */}
          <SalesChart data={WEEKLY_SALES} />

          {/* Tabla */}
          <OrdersTable
            orders={RECENT_ORDERS}
            onVerTodo={() => navigate("/admin/pedidos")}
          />

        </main>
      </div>
    </div>
  );
}