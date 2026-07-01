// VISTA — gestión de usuarios del panel admin
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsuarios, toggleEstadoUsuario } from '../../redux/usuariosSlice'
import Swal from 'sweetalert2'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import FiltrosBotones from "../../components/FiltrosBotones"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const ITEMS_POR_PAGINA = 15
const AVATAR_BG = "bg-[#CBAAE9]"

export default function GestionUsuarios() {

  const dispatch = useDispatch()
  const { items: usuarios, loading, error, status } = useSelector((state) => state.usuarios)

  // HOOK useState — estados locales de UI
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroActivo, setFiltroActivo] = useState("Todos")

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsuarios())
  }, [dispatch, status])

  // RENDERIZADO CONDICIONAL — excluye admins y filtra según estado activo
  const usuariosFiltrados = usuarios
    .filter(u => u.role !== 'ADMINISTRADOR')
    .filter(u => {
      if (filtroActivo === "Todos") return true
      if (filtroActivo === "Activo") return u.activo === true
      if (filtroActivo === "Inactivo") return u.activo === false
      return true
    })

  const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_POR_PAGINA))
  const usuariosPagina = usuariosFiltrados.slice((currentPage - 1) * ITEMS_POR_PAGINA, currentPage * ITEMS_POR_PAGINA)

  const handleFiltroActivo = (v) => { setFiltroActivo(v); setCurrentPage(1) }

  // No GET después del PATCH — el store se actualiza directo con la respuesta
  const cambiarEstadoUsuario = async (idUsuario, activoActual) => {
    const accion = activoActual ? 'desactivar' : 'activar'
    const resultado = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      text: `¿Estás segura de que querés ${accion} este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4b385c',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
    })

    if (resultado.isConfirmed) {
      dispatch(toggleEstadoUsuario(idUsuario))
    }
  }

  const rolStyle = (rol) => rol === "Administrador"
    ? "bg-purple-100 text-purple-700 border border-purple-200"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200"

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          {/* COMPONENTE reutilizable — título sin botón */}
          <EncabezadoSeccion titulo="Gestión de usuarios" />

          {loading && <p className="text-gray-400 text-sm">Cargando usuarios...</p>}
          {error   && <p className="text-red-400 text-sm">No se pudieron cargar los usuarios.</p>}

          {!loading && !error && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                {/* COMPONENTE reutilizable — botones de filtro */}
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
                      {["USUARIO", "ROL", "ESTADO", ...(filtroActivo !== "Todos" ? ["ACCIONES"] : [])].map(h => (
                        <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* RENDERIZADO DE LISTA con .map() */}
                    {usuariosPagina.map(usuario => {
                      const nombreCompleto = `${usuario.firstName || ""} ${usuario.lastName || ""}`.trim()
                      const iniciales = `${usuario.firstName?.[0] || ""}${usuario.lastName?.[0] || ""}`.toUpperCase()
                      const rol = usuario.role === "ADMINISTRADOR" ? "Administrador" : "Usuario"

                      return (
                        <tr
                          key={usuario.idUsuario}
                          className={`transition-colors ${
                            usuario.activo
                              ? 'hover:bg-purple-50/30'
                              : 'bg-gray-50/60 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${AVATAR_BG} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                {iniciales}
                              </div>
                              <p className="text-base font-semibold text-gray-800">
                                {nombreCompleto}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${rolStyle(rol)}`}>
                              {rol}
                            </span>
                          </td>

                          {/* Badge de estado — igual que GestionLibros */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              usuario.activo
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${usuario.activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          {/* Botón de acción — solo visible cuando hay un filtro activo */}
                          <td className="px-6 py-4">
                            {filtroActivo !== "Todos" && (
                              <button
                                onClick={() => cambiarEstadoUsuario(usuario.idUsuario, usuario.activo)}
                                className="text-xs px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                              >
                                {usuario.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {usuariosPagina.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">No se encontraron usuarios.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={usuariosFiltrados.length} itemsPerPage={ITEMS_POR_PAGINA} itemLabel="usuarios" onPageChange={page => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }} />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}