// VISTA — gestión de usuarios del panel admin
import { useEffect, useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import FiltrosBotones from "../../components/FiltrosBotones"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const ITEMS_POR_PAGINA = 15
const AVATAR_BG = "bg-[#CBAAE9]"

export default function GestionUsuarios() {

  // HOOK useState — estados locales del componente
  const [usuarios, setUsuarios] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroActivo, setFiltroActivo] = useState("Todos")

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const token = localStorage.getItem("jwtToken") || localStorage.getItem("token")

      const response = await fetch("http://localhost:4002/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      }
    }

    obtenerUsuarios()
  }, [])

  // RENDERIZADO CONDICIONAL — filtra según el estado activo
  const usuariosFiltrados = usuarios.filter(u => {
    if (filtroActivo === "Todos") return true
    if (filtroActivo === "Activo") return u.activo === true
    if (filtroActivo === "Inactivo") return u.activo === false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_POR_PAGINA))
  const usuariosPagina = usuariosFiltrados.slice((currentPage - 1) * ITEMS_POR_PAGINA, currentPage * ITEMS_POR_PAGINA)

  const handleFiltroActivo = (v) => { setFiltroActivo(v); setCurrentPage(1) }

  const cambiarEstadoUsuario = async (idUsuario) => {
    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token")

    const response = await fetch(`http://localhost:4002/usuarios/${idUsuario}/activo`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.ok) {
      const usuarioActualizado = await response.json()

      setUsuarios(prev =>
        prev.map(u =>
          u.idUsuario === idUsuario ? usuarioActualizado : u
        )
      )
    }
  }

  const rolStyle = (rol) => rol === "Administrador"
    ? "bg-purple-100 text-purple-700 border border-purple-200"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200"

  const estadoStyle = (activo) => activo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500"

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título sin botón
  */}
          <EncabezadoSeccion titulo="Gestión de usuarios" />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              {/* COMPONENTE reutilizable — botones de filtro
  */}
              <FiltrosBotones
                opciones={["Todos", "Activo", "Inactivo"]}
                activo={filtroActivo}
                onChange={handleFiltroActivo}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["USUARIO", "ROL", "ESTADO"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* RENDERIZADO DE LISTA con .map()
  */}
                  {usuariosPagina.map(usuario => {
                    const nombreCompleto = `${usuario.firstName || ""} ${usuario.lastName || ""}`.trim()
                    const iniciales = `${usuario.firstName?.[0] || ""}${usuario.lastName?.[0] || ""}`.toUpperCase()
                    const rol = usuario.role === "ADMINISTRADOR" ? "Administrador" : "Usuario"

                    return (
                      <tr key={usuario.idUsuario} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${AVATAR_BG} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {iniciales}
                            </div>
                            <div>
                              <p className="text-base font-semibold text-gray-800">
                                  {nombreCompleto}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${rolStyle(rol)}`}>
                            {rol}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => cambiarEstadoUsuario(usuario.idUsuario)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${estadoStyle(usuario.activo)}`}
                          >
                            {usuario.activo ? "Activo" : "Inactivo"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {usuariosPagina.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-16 text-center text-gray-400 text-sm">No se encontraron usuarios.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={usuariosFiltrados.length} itemsPerPage={ITEMS_POR_PAGINA} itemLabel="usuarios" onPageChange={page => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }} />
          </div>

        </main>
      </div>
    </div>
  )
}