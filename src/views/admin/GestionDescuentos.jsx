import { useEffect, useState } from 'react'
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Pagination from "../../components/Pagination"
import ModalFormulario from "../../components/ModalFormulario"
import EncabezadoSeccion from "../../components/EncabezadoSeccion"

const POR_PAGINA = 9
const API_URL = "http://localhost:4002/descuentos"

const inputClass =
  "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100"

function GestionDescuentos() {
  const [lista, setLista] = useState([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [modal, setModal] = useState(null)
  const [porcentaje, setPorcentaje] = useState("")

  const [errorPorcentaje, setErrorPorcentaje] = useState("")

  const token = localStorage.getItem("jwtToken") || localStorage.getItem("token")

  const cargarDescuentos = async () => {
    const response = await fetch(`${API_URL}?page=${pagina - 1}&size=${POR_PAGINA}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      console.error("Error al cargar descuentos")
      return
    }

    const data = await response.json()

    setLista(data.content)
    setTotalPaginas(data.totalPages)
    setTotalItems(data.totalElements)
  }

  useEffect(() => {
    cargarDescuentos()
  }, [pagina])

  const abrirCrear = () => {
    setPorcentaje("")
    setErrorPorcentaje("")
    setModal("crear")
  }

  const cerrarModal = () => {
    setModal(null)
  }

  const crearDescuento = async () => {
    const numeroPorcentaje = Number(porcentaje)

    if (!porcentaje.trim()) {
      setErrorPorcentaje("Ingresá un porcentaje.")
      return
    }

    if (numeroPorcentaje < 1 || numeroPorcentaje > 100) {
      setErrorPorcentaje("El descuento debe estar entre 1% y 100%.")
      return
    }

    setErrorPorcentaje("")

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        porcentaje: numeroPorcentaje
      })
    })

    if (!response.ok) {
      setErrorPorcentaje("No se pudo crear el descuento.")
      return
    }

    cerrarModal()
    cargarDescuentos()
  }

  const toggleActivo = async (id) => {
    const response = await fetch(`${API_URL}/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      console.error("Error al cambiar estado del descuento")
      return
    }

    cargarDescuentos()
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />

      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />

        <main className="flex-1 p-8 space-y-6">
          <EncabezadoSeccion
            titulo="Gestión de descuentos"
            textBoton="Nuevo Descuento"
            onAccion={abrirCrear}
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["PORCENTAJE", "ESTADO", "ACCIONES"].map(h => (
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
                  {lista.map(descuento => (
                    <tr key={descuento.id} className="hover:bg-purple-50/30 transition-colors">

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {descuento.porcentaje}%
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            descuento.activo
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              descuento.activo ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {descuento.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActivo(descuento.id)}
                          className="text-xs px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          {descuento.activo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No hay descuentos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              totalItems={totalItems}
              itemsPerPage={POR_PAGINA}
              itemLabel="descuentos"
              onPageChange={setPagina}
            />
          </div>

          {modal && (
            <ModalFormulario
              titulo="Nuevo Descuento"
              onCerrar={cerrarModal}
              onAceptar={crearDescuento}
              deshabilitado={
                !porcentaje.trim() ||
                Number(porcentaje) < 1 ||
                Number(porcentaje) > 100
              }
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Porcentaje de descuento
                </label>

                <input
                  autoFocus
                  type="number"
                  min="1"
                  max="100"
                  className={inputClass}
                  placeholder="Ej: 15"
                  value={porcentaje}
                  onChange={e => {
                    const valor = e.target.value
                    setPorcentaje(valor)

                    if (!valor.trim()) {
                      setErrorPorcentaje("")
                    } else if (Number(valor) < 1 || Number(valor) > 100) {
                      setErrorPorcentaje("El descuento debe estar entre 1% y 100%.")
                    } else {
                      setErrorPorcentaje("")
                    }
                  }}
                  onKeyDown={e => e.key === "Enter" && crearDescuento()}
                />
                {errorPorcentaje && (
                  <p className="mt-1 text-xs text-red-600">
                    {errorPorcentaje}
                  </p>
                )}
              </div>
            </ModalFormulario>
          )}
        </main>
      </div>
    </div>
  )
}

export default GestionDescuentos