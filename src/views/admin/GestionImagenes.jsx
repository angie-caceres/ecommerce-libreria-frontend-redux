import { useState, useEffect } from "react";
import { Plus, Image, Trash2 } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../services/api";
import Swal from "sweetalert2";

export default function GestionImagenes() {
  const token =
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("token")

  // HOOK useState — estado local de las imágenes cargadas
  const [imagenes, setImagenes] = useState([])

  // HOOK useState — estado local del formulario
  const [nombre, setNombre] = useState("")
  const [archivo, setArchivo] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const obtenerImagenes = async () => {
    try {
      const data = await apiFetch("/imagenes/todas", token)
      setImagenes(data)
    } catch (err) {
      console.error("Error al traer imágenes de MySQL:", err)
    }
  }

  useEffect(() => {
    if (token) {
      obtenerImagenes()
    }
  }, [token])

  // EVENTO — agrega una nueva imagen al estado
  // Usa URL.createObjectURL para crear una URL temporal del archivo
  // No modifica el estado directamente
  const handleAgregarImagen = async (e) => {
    e.preventDefault()

    if (!nombre.trim() || !archivo) {
      // Validación con estado — no usa alert() ni toca el DOM
      setMensaje("Completá todos los campos")
      return
    }

    setCargando(true)
    setMensaje("")

    try {
      const formData = new FormData()
      formData.append("name", nombre)
      formData.append("file", archivo) // "file" coincide con el DTO AddFileRequest de tu Java

      // USAMOS FETCH NATIVO directo a tu puerto del backend
      // Al NO pasarle ningún Header de Content-Type, el navegador le clava
      // automáticamente el formato binario real y Java lo recibe perfecto.
      const response = await fetch("http://localhost:4002/imagenes", {
        method: "POST",
        body: formData,
        headers: {
          // Le pasamos solo el Token si tu backend lo pide para seguridad
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Error ${response.status}`)
      }

      setMensaje("Imagen cargada correctamente en el servidor")
      setNombre("")
      setArchivo(null)
      
      // Volvemos a consultar la base de datos para refrescar la lista en pantalla
      obtenerImagenes()

    } catch (err) {
      setMensaje(err.message || "Error al subir la imagen.")
    } finally {
      setCargando(false)
    }

    setTimeout(() => setMensaje(""), 4000)
  }

  // EVENTO — elimina una imagen del estado por id
  // Usa filter sin modificar el array directamente
  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7b5b99",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      await apiFetch(`/imagenes/${id}`, token, {
        method: "DELETE"
      });

      setImagenes((prev) => prev.filter((imagen) => imagen.id !== id));

      Swal.fire({
        title: "¡Eliminada!",
        text: "La imagen fue eliminada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la imagen del servidor.",
        icon: "error"
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
              <h1 className="text-4xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Gestión de Imágenes
              </h1>
              <p className="text-gray-500 text-sm">
                Administrá las imágenes disponibles para los productos
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cargar nueva imagen
            </h2>

            <form onSubmit={handleAgregarImagen} className="grid grid-cols-1 md:grid-cols-3 gap-4" >

              {/* Nombre de la imagen */}
              <input
                type="text"
                placeholder="Nombre de la imagen"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setMensaje('') }}
                className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none text-sm"
                disabled={cargando}
              />

              {/* Selector de archivo personalizado */}
              <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-gray-400 whitespace-nowrap">Seleccionar archivo</span>
                <span className="truncate italic text-gray-700">
                  {archivo ? `"${archivo.name}"` : ""}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { setArchivo(e.target.files[0] || null); setMensaje('') }}
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

            {/* RENDERIZADO CONDICIONAL con &&
                Solo muestra el mensaje si existe */}
            {mensaje && (
              <p className="mt-4 text-sm font-semibold text-[#7b5b99]">
                {mensaje}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Imágenes cargadas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
              {imagenes.length === 0 ? (
                <p className="text-gray-400 text-sm italic col-span-full text-center py-4">
                  No hay imágenes subidas en el servidor todavía.
                </p>
              ) : (
                imagenes.map((imagen) => (
                  <div key={imagen.id} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-[#faf9f6] flex flex-col justify-between">
                    
                    {/* Contenedor fijo para la previsualización */}
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
  )
}