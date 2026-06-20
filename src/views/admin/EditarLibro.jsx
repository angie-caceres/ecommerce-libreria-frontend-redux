// VISTA — editar libro del panel admin
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Alerta from "../../components/Alerta"
import { apiFetch } from "../../services/api"

function FormField({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full px-4 py-2.5 text-sm text-[#544341] bg-white border border-[#CBC4CE] rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-[#EBE5F2] focus:border-[#7B5B98] " +
  "placeholder:text-[#877270] transition-colors"

export default function EditarLibro({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()

  // HOOK useState — datos del libro original, traídos del backend
  const [libroOriginal, setLibroOriginal] = useState(null)

  // HOOK useState — estado del formulario
  const [form, setForm] = useState({
    titulo: "", descripcion: "", paginas: "", precio: "",
    stock: "", genero: "", editorial: "", autores: "",
  })

  const [generos, setGeneros] = useState([])
  const [editoriales, setEditoriales] = useState([])
  const [autores, setAutores] = useState([])

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [updated, setUpdated] = useState(false)
  const [errors, setErrors] = useState({})

  // HOOK useEffect — trae el libro y los selectores al montar
  useEffect(() => {
    console.log('EditarLibro - token recibido:', token, 'id:', id)
    if (!token) return

    const cargarTodo = async () => {
      setCargando(true)
      setError(null)
      try {
        const [libro, dataGeneros, dataEditoriales, dataAutores] = await Promise.all([
          apiFetch(`/libros/${id}`, token),
          apiFetch("/generos", token),
          apiFetch("/editoriales", token),
          apiFetch("/autores", token),
        ])

        setGeneros(dataGeneros)
        setEditoriales(dataEditoriales)
        setAutores(dataAutores)
        setLibroOriginal(libro)

        // Busca el id del género y editorial actuales comparando por nombre
        // (el backend devuelve LibroResponse con nombres, no ids)
        const generoActual = dataGeneros.find(g => g.nombre === libro.genero)
        const editorialActual = dataEditoriales.find(e => e.nombre === libro.editorial)
        const autorActual = dataAutores.find(a =>
          libro.autores?.[0] === `${a.nombre} ${a.apellido}`.trim()
        )

        setForm({
          titulo: libro.titulo || "",
          descripcion: libro.descripcion || "",
          paginas: libro.paginas || "",
          precio: libro.precio || "",
          stock: libro.stock || "",
          genero: generoActual?.idGenero?.toString() || "",
          editorial: editorialActual?.id?.toString() || "",
          autores: autorActual?.idAutor?.toString() || "",
        })

      } catch (err) {
        setError("No se pudo cargar el libro.")
      } finally {
        setCargando(false)
      }
    }

    cargarTodo()
  }, [id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio"
    if (!String(form.precio).trim()) e.precio = "Ingresá un precio"
    if (!form.genero) e.genero = "Seleccioná un género"
    if (!form.editorial) e.editorial = "Seleccioná una editorial"
    return e
  }

  // EVENTO — guarda los cambios llamando a los PATCH correspondientes
  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setGuardando(true)
    setError(null)

    try {
      // 1. PATCH datos básicos: título, descripción, precio, páginas
      await apiFetch(`/libros/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          paginas: parseInt(form.paginas) || 0,
          precio: parseFloat(form.precio) || 0,
          stock: 0,
          idGenero: null,
          idEditorial: null,
          idDescuento: null,
          idAutores: [],
        })
      })

      // 2. PATCH género — solo si cambió
      const generoOriginalId = generos.find(g => g.nombre === libroOriginal.genero)?.idGenero
      if (form.genero && Number(form.genero) !== generoOriginalId) {
        await apiFetch(`/libros/${id}/genero/${form.genero}`, token, { method: "PATCH" })
      }

      // 3. PATCH editorial — solo si cambió
      const editorialOriginalId = editoriales.find(e => e.nombre === libroOriginal.editorial)?.id
      if (form.editorial && Number(form.editorial) !== editorialOriginalId) {
        await apiFetch(`/libros/${id}/editorial/${form.editorial}`, token, { method: "PATCH" })
      }

      // 4. PATCH autores — solo si cambió
      if (form.autores) {
        await apiFetch(`/libros/${id}/autores`, token, {
          method: "PATCH",
          body: JSON.stringify([parseInt(form.autores)])
        })
      }

      // 5. PATCH stock — solo si se ingresó una cantidad a sumar
      const stockNum = parseInt(form.stock)
      if (stockNum > 0) {
        await apiFetch(`/libros/${id}/stock?cantidad=${stockNum}`, token, { method: "PATCH" })
      }

      setUpdated(true)
      setTimeout(() => setUpdated(false), 3000)

    } catch (err) {
      setError(err.message || "No se pudo actualizar el libro.")
    } finally {
      setGuardando(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin/libros")
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] font-serif flex items-center justify-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Cargando libro...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />
      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />
        <main className="flex-1 p-8 space-y-6">

          <div>
            <h2 className="text-4xl text-[#1C1B1B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Editar Libro
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Modificá los detalles de la obra literaria.
            </p>
          </div>

          {updated && (
            <Alerta texto="¡Libro actualizado correctamente!" onClose={() => setUpdated(false)} icono={false} />
          )}

          {error && (
            <p className="text-center text-red-500 font-bold tracking-wide py-2 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

            <FormField label="Título del libro">
              <input type="text" name="titulo" value={form.titulo} onChange={handleChange} className={inputClass} disabled={guardando} />
              {errors.titulo && <p className="text-xs text-red-500">{errors.titulo}</p>}
            </FormField>

            <FormField label="Descripción">
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} disabled={guardando} />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <FormField label="Páginas">
                <input type="number" name="paginas" value={form.paginas} onChange={handleChange} min="1" className={inputClass} disabled={guardando} />
              </FormField>

              <FormField label="Precio (ARS)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} min="0" step="0.01" className={`${inputClass} pl-7`} disabled={guardando} />
                </div>
                {errors.precio && <p className="text-xs text-red-500 mt-0.5">{errors.precio}</p>}
              </FormField>

              <FormField label="Sumar stock">
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0" className={inputClass} disabled={guardando} />
                <p className="text-xs text-gray-400 mt-1">Cantidad a agregar al stock actual</p>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Género">
                <select name="genero" value={form.genero} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} disabled={guardando}>
                  <option value="">Seleccionar género</option>
                  {generos.map(g => (
                    <option key={g.idGenero} value={g.idGenero}>{g.nombre}</option>
                  ))}
                </select>
                {errors.genero && <p className="text-xs text-red-500">{errors.genero}</p>}
              </FormField>

              <FormField label="Editorial">
                <select name="editorial" value={form.editorial} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} disabled={guardando}>
                  <option value="">Seleccionar editorial</option>
                  {editoriales.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
                {errors.editorial && <p className="text-xs text-red-500">{errors.editorial}</p>}
              </FormField>
            </div>

            <FormField label="Autor">
              <select name="autores" value={form.autores} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} disabled={guardando}>
                <option value="">Seleccionar autor</option>
                {autores.map(a => (
                  <option key={a.idAutor} value={a.idAutor}>
                    {`${a.nombre} ${a.apellido || ''}`.trim()}
                  </option>
                ))}
              </select>
            </FormField>

          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={handleCancel} className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" disabled={guardando}>
              Cancelar
            </button>
            <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-bold text-white bg-[#473954] rounded-xl hover:bg-[#3A3074] active:scale-95 transition-all shadow-sm" disabled={guardando}>
              {guardando ? "GUARDANDO..." : "Actualizar Libro"}
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}