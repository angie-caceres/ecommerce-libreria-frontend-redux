import { useState } from "react";
import { Plus, Image, Trash2 } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";

export default function GestionImagenes() {

  // HOOK useState — estado local de las imágenes cargadas
  const [imagenes, setImagenes] = useState([
    { id: 1, nombre: "1984", url: "/libros/1984.png" },
    { id: 2, nombre: "El Hobbit", url: "/libros/elhobbit.png" },
    { id: 3, nombre: "Amanecer en la cosecha", url: "/libros/juegos.png" },
  ])

  // HOOK useState — estado local del formulario
  const [nombre, setNombre] = useState("")
  const [archivo, setArchivo] = useState(null)
  const [mensaje, setMensaje] = useState("")

  // EVENTO — agrega una nueva imagen al estado
  // Usa URL.createObjectURL para crear una URL temporal del archivo
  // No modifica el estado directamente
  const handleAgregarImagen = (e) => {
    e.preventDefault()

    if (!nombre.trim() || !archivo) {
      // Validación con estado — no usa alert() ni toca el DOM
      setMensaje("Completá todos los campos")
      return
    }

    // Crea una URL temporal del archivo seleccionado
    // Solo funciona mientras la página está abierta — con backend se subiría al servidor
    const urlLocal = URL.createObjectURL(archivo)

    const nuevaImagen = {
      id: Date.now(),
      nombre,
      url: urlLocal,
    }

    // Agrega la nueva imagen al array sin modificar el estado directamente
    setImagenes([...imagenes, nuevaImagen])
    setNombre("")
    setArchivo(null)
    setMensaje("Imagen cargada correctamente")
    setTimeout(() => setMensaje(""), 3000)
  }

  // EVENTO — elimina una imagen del estado por id
  // Usa filter sin modificar el array directamente
  const handleEliminar = (id) => {
    setImagenes(imagenes.filter((imagen) => imagen.id !== id))
  }

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

            <form onSubmit={handleAgregarImagen} className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Nombre de la imagen */}
              <input
                type="text"
                placeholder="Nombre de la imagen"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setMensaje('') }}
                className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none text-sm"
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
                />
              </label>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#CBAAE9] text-white text-sm font-semibold hover:opacity-90"
              >
                <Plus size={18} />
                Cargar imagen
              </button>
            </form>

            {/* RENDERIZADO CONDICIONAL con &&
                Solo muestra el mensaje si existe
  */}
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

            {/* RENDERIZADO DE LISTA con .map()
                Cada imagen se renderiza como una tarjeta
                Siempre con key única
  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
              {imagenes.map((imagen) => (
                <div key={imagen.id} className="border border-gray-100 rounded-xl p-4 shadow-sm">

                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    {/* RENDERIZADO CONDICIONAL con ternario
                        Si tiene URL muestra la imagen, sino muestra ícono placeholder
  */}
                    {imagen.url ? (
                      <img
                        src={imagen.url}
                        alt={imagen.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image size={32} className="text-gray-400" />
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 text-sm">{imagen.nombre}</h3>

                  {/* EVENTO onClick — elimina la imagen del estado
  */}
                  <button
                    onClick={() => handleEliminar(imagen.id)}
                    className="flex items-center gap-2 text-red-500 text-xs font-semibold hover:underline"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>

                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}