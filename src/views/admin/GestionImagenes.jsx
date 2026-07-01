import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Swal from "sweetalert2";
import { fetchImagenes, eliminarImagen } from "../../redux/imagenesSlice";
import axios from "axios"

export default function GestionImagenes() {
  const dispatch = useDispatch();

  const {
    items: imagenes,
    loading,
    error,
  } = useSelector((state) => state.imagenes);

  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    dispatch(fetchImagenes());
  }, [dispatch]);

  const handleAgregarImagen = async (e) => {
    e.preventDefault()

    if (!nombre.trim() || !archivo) {
      setMensaje("Completá todos los campos")
      return
    }

    setCargando(true)
    setMensaje("")

    try {
      const formData = new FormData()
      formData.append("name", nombre)
      formData.append("file", archivo)

      await axios.post("http://localhost:4002/imagenes", formData)

      setMensaje("Imagen cargada correctamente en el servidor")
      setNombre("")
      setArchivo(null)
      dispatch(fetchImagenes())
    } catch (err) {
      setMensaje(err.response?.data?.message || err.message || "Error al subir la imagen.")
    } finally {
      setCargando(false)
    }

    setTimeout(() => setMensaje(""), 4000)
  }

  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7b5b99",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    const respuesta = await dispatch(eliminarImagen(id));

    if (eliminarImagen.fulfilled.match(respuesta)) {
      Swal.fire({
        title: "¡Eliminada!",
        text: "La imagen fue eliminada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      const mensajeError = respuesta.error?.message || "";

      const estaEnUso = mensajeError
        .toLowerCase()
        .includes("asociada a un libro");

      Swal.fire({
        title: estaEnUso ? "Imagen en uso" : "Error",
        text: estaEnUso
          ? "No se puede eliminar esta imagen porque está asociada a un libro."
          : "No se pudo eliminar la imagen del servidor.",
        icon: estaEnUso ? "warning" : "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex font-serif">
      <Sidebar />

      <main className="flex-1 ml-56">
        <HeaderAdmin titulo="Gestión de Imágenes" />

        <div className="p-8 bg-[#f7f4ef] min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-4xl text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Gestión de Imágenes
              </h1>
              <p className="text-gray-500 text-sm">
                Administrá las imágenes disponibles para los productos
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-semibold bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              ⚠️ {error}
            </p>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2
              className="text-2xl text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cargar nueva imagen
            </h2>

            <form
              onSubmit={handleAgregarImagen}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                placeholder="Nombre de la imagen"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setMensaje("");
                }}
                className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none text-sm"
                disabled={cargando}
              />

              <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-gray-400 whitespace-nowrap">
                  Seleccionar archivo
                </span>
                <span className="truncate italic text-gray-700">
                  {archivo ? `"${archivo.name}"` : ""}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setArchivo(e.target.files[0] || null);
                    setMensaje("");
                  }}
                  disabled={cargando}
                />
              </label>

              <button
                type="submit"
                disabled={cargando}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#CBAAE9] text-white text-sm font-semibold hover:opacity-90"
              >
                <Plus size={18} />
                {cargando ? "Cargando..." : "Cargar imagen"}
              </button>
            </form>

            {mensaje && (
              <p className="mt-4 text-sm font-semibold text-[#7b5b99]">
                {mensaje}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2
                className="text-2xl text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Imágenes cargadas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
              {loading && imagenes.length === 0 ? (
                <p className="text-gray-400 text-sm italic col-span-full text-center py-4">
                  Cargando imágenes...
                </p>
              ) : imagenes.length === 0 ? (
                <p className="text-gray-400 text-sm italic col-span-full text-center py-4">
                  No hay imágenes subidas en el servidor todavía.
                </p>
              ) : (
                imagenes.map((imagen) => (
                  <div
                    key={imagen.id}
                    className="border border-gray-100 rounded-xl p-4 shadow-sm bg-[#faf9f6] flex flex-col justify-between"
                  >
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4 p-1">
                      <img
                        src={`data:image/jpeg;base64,${imagen.file}`}
                        alt={imagen.nombre || "Portada"}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-2 truncate">
                        {imagen.name || imagen.nombreArchivo}
                      </h3>

                      <button
                        onClick={() => handleEliminar(imagen.id)}
                        className="flex items-center gap-2 text-red-500 text-xs font-semibold hover:underline mt-2"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}