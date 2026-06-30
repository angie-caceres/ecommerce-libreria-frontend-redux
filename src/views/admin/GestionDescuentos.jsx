import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";
import ModalFormulario from "../../components/ModalFormulario";
import EncabezadoSeccion from "../../components/EncabezadoSeccion";
import {
  fetchDescuentos,
  crearDescuento,
  toggleDescuento,
} from "../../redux/descuentosSlice";

const POR_PAGINA = 9;

const inputClass =
  "w-full border border-purple-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-100";

function GestionDescuentos() {
  const dispatch = useDispatch();

  const {
    lista,
    totalPaginas,
    totalItems,
    loading,
    error,
  } = useSelector((state) => state.descuentos);

  const [pagina, setPagina] = useState(1);
  const [modal, setModal] = useState(null);
  const [porcentaje, setPorcentaje] = useState("");
  const [errorPorcentaje, setErrorPorcentaje] = useState("");

  useEffect(() => {
    dispatch(fetchDescuentos(pagina));
  }, [dispatch, pagina]);

  const abrirCrear = () => {
    setPorcentaje("");
    setErrorPorcentaje("");
    setModal("crear");
  };

  const cerrarModal = () => {
    setModal(null);
  };

  const handleCrearDescuento = async () => {
    const numeroPorcentaje = Number(porcentaje);

    if (!porcentaje.trim()) {
      setErrorPorcentaje("Ingresá un porcentaje.");
      return;
    }

    if (numeroPorcentaje < 0 || numeroPorcentaje > 100) {
      setErrorPorcentaje("El descuento debe estar entre 0% y 100%.");
      return;
    }

    setErrorPorcentaje("");

    const resultado = await dispatch(crearDescuento(numeroPorcentaje));

    if (crearDescuento.fulfilled.match(resultado)) {
      cerrarModal();
      dispatch(fetchDescuentos(pagina));
    } else {
      setErrorPorcentaje("No se pudo crear el descuento.");
    }
  };

  const handleToggleActivo = async (id) => {
    const resultado = await dispatch(toggleDescuento(id));

    if (toggleDescuento.fulfilled.match(resultado)) {
      dispatch(fetchDescuentos(pagina));
    }
  };

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

          {error && (
            <p className="text-sm text-red-500 font-semibold bg-red-50 p-4 rounded-xl border border-red-100">
              ⚠️ {error}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["PORCENTAJE", "ESTADO", "ACCIONES"].map((h) => (
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
                  {loading && lista.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-16 text-center text-gray-400 text-sm animate-pulse"
                      >
                        Cargando descuentos...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    lista.map((descuento) => (
                      <tr
                        key={descuento.id}
                        className="hover:bg-purple-50/30 transition-colors"
                      >
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
                                descuento.activo
                                  ? "bg-emerald-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            {descuento.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActivo(descuento.id)}
                            className="text-xs px-3 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            {descuento.activo ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))}

                  {!loading && lista.length === 0 && !error && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-16 text-center text-gray-400 text-sm"
                      >
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
              onAceptar={handleCrearDescuento}
              deshabilitado={
                !porcentaje.trim() ||
                Number(porcentaje) < 0 ||
                Number(porcentaje) > 100 ||
                loading
              }
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Porcentaje de descuento
                </label>

                <input
                  autoFocus
                  type="number"
                  min="0"
                  max="100"
                  className={inputClass}
                  placeholder="Ej: 15"
                  value={porcentaje}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setPorcentaje(valor);

                    if (!valor.trim()) {
                      setErrorPorcentaje("");
                    } else if (Number(valor) < 0 || Number(valor) > 100) {
                      setErrorPorcentaje(
                        "El descuento debe estar entre 0% y 100%."
                      );
                    } else {
                      setErrorPorcentaje("");
                    }
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !loading && handleCrearDescuento()
                  }
                  disabled={loading}
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
  );
}

export default GestionDescuentos;