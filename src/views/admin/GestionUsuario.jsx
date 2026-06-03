// VISTA — gestión de usuarios del panel admin
import { useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import FiltrosBotones from "../../components/FiltrosBotones"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const USUARIOS = [
  { id: 1,  nombre: "Eleanor Vance",   iniciales: "EV", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 2,  nombre: "Julian Barnes",   iniciales: "JB", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 3,  nombre: "Clara Oswald",    iniciales: "CO", desde: 2023, rol: "Usuario",       activo: false },
  { id: 4,  nombre: "Arthur Dent",     iniciales: "AD", desde: 2024, rol: "Usuario",       activo: true  },
  { id: 5,  nombre: "Sarah Connor",    iniciales: "SC", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 6,  nombre: "Mateo García",    iniciales: "MG", desde: 2022, rol: "Usuario",       activo: true  },
  { id: 7,  nombre: "Lucía Beltrón",   iniciales: "LB", desde: 2023, rol: "Usuario",       activo: false },
  { id: 8,  nombre: "Facundo Pereyra", iniciales: "FP", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 9,  nombre: "Ana Valente",     iniciales: "AV", desde: 2021, rol: "Usuario",       activo: true  },
  { id: 10, nombre: "Omar S.",         iniciales: "OS", desde: 2024, rol: "Usuario",       activo: true  },
  { id: 11, nombre: "Elena Helman",    iniciales: "EH", desde: 2022, rol: "Usuario",       activo: true  },
  { id: 12, nombre: "Richard A.",      iniciales: "RA", desde: 2023, rol: "Usuario",       activo: false },
  { id: 13, nombre: "Daniel Miller",   iniciales: "DM", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 14, nombre: "Sam Winchester",  iniciales: "SW", desde: 2024, rol: "Usuario",       activo: true  },
  { id: 15, nombre: "John Watson",     iniciales: "JW", desde: 2020, rol: "Usuario",       activo: true  },
  { id: 16, nombre: "Marta Reyes",     iniciales: "MR", desde: 2022, rol: "Usuario",       activo: true  },
  { id: 17, nombre: "Lucas Prieto",    iniciales: "LP", desde: 2023, rol: "Usuario",       activo: false },
  { id: 18, nombre: "Valentina Cruz",  iniciales: "VC", desde: 2024, rol: "Usuario",       activo: true  },
  { id: 19, nombre: "Ignacio Romero",  iniciales: "IR", desde: 2021, rol: "Usuario",       activo: true  },
  { id: 20, nombre: "Florencia Paz",   iniciales: "FP", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 21, nombre: "Bruno Navarro",   iniciales: "BN", desde: 2022, rol: "Usuario",       activo: false },
  { id: 22, nombre: "Camila Torres",   iniciales: "CT", desde: 2024, rol: "Usuario",       activo: true  },
  { id: 23, nombre: "Sebastián Ríos",  iniciales: "SR", desde: 2023, rol: "Usuario",       activo: true  },
  { id: 24, nombre: "Natalia Ibáñez",  iniciales: "NI", desde: 2020, rol: "Administrador", activo: true  },
]

const ITEMS_POR_PAGINA = 15
const AVATAR_BG = "bg-[#CBAAE9]"

export default function GestionUsuarios() {

  // HOOK useState — estados locales del componente
  const [usuarios, setUsuarios]       = useState(USUARIOS)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtroActivo, setFiltroActivo] = useState("Todos")

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

  const cambiarEstadoUsuario = (id) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u))
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

          {/* COMPONENTE reutilizable — título sin botón  */}
          <EncabezadoSeccion titulo="Gestión de usuarios" />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              {/* COMPONENTE reutilizable — botones de filtro  */}
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
                  {/* RENDERIZADO DE LISTA con .map()  */}
                  {usuariosPagina.map(usuario => (
                    <tr key={usuario.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${AVATAR_BG} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                            {usuario.iniciales}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-800">{usuario.nombre}</p>
                            <p className="text-xs text-gray-400">Miembro desde {usuario.desde}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${rolStyle(usuario.rol)}`}>{usuario.rol}</span>
                      </td>
                      <td className="px-6 py-4">
                        {/* EVENTO onClick — cambia el estado del usuario  */}
                        <button onClick={() => cambiarEstadoUsuario(usuario.id)} className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${estadoStyle(usuario.activo)}`}>
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                    </tr>
                  ))}
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