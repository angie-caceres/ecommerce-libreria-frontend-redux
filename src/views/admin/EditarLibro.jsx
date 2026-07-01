// VISTA — editar libro del panel admin
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import HeaderAdmin from "../../components/HeaderAdmin"
import Sidebar from "../../components/Sidebar"
import Alerta from "../../components/Alerta"
import { fetchLibroByIdAdmin, editarLibro } from "../../redux/librosSlice"
import { fetchGeneros } from "../../redux/generosSlice"
import { fetchAutores } from "../../redux/autoresSlice"
import { fetchImagenes } from "../../redux/imagenesSlice"
import { fetchDescuentos } from "../../redux/descuentosSlice"

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

export default function EditarLibro() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const dispatch   = useDispatch()

  const libroOriginal = useSelector((state) => state.libros.libroActual)
  const guardando     = useSelector((state) => state.libros.loading)
  const generos       = useSelector((state) => state.generos.items)
  const autores       = useSelector((state) => state.autores.items)
  const imagenes      = useSelector((state) => state.imagenes.items)
  const descuentos    = useSelector((state) => state.descuentos.lista)
  const editoriales   = useSelector((state) => state.editoriales.items)

  const [form, setForm] = useState({
    titulo: "", descripcion: "", paginas: "", precio: "",
    stock: "0", genero: "", editorial: "", autores: "",
    imagenId: "", descuento: "",
  })

  const [errors, setErrors]   = useState({})
  const [updated, setUpdated] = useState(false)

  const { statusAdmin } = useSelector(state => state.libros)

  const statusGeneros = useSelector(state => state.generos.status)
  const statusAutores = useSelector(state => state.autores.status)
  const statusImagenes = useSelector(state => state.imagenes.status)
  const statusDescuentos = useSelector(state => state.descuentos.status)

  useEffect(() => {
    if (!libroOriginal) {
      dispatch(fetchLibroByIdAdmin(id))
    }
    if (statusGeneros === "idle") {
      dispatch(fetchGeneros())
    }
    if (statusAutores === "idle") {
      dispatch(fetchAutores())
    }

    if (statusImagenes === "idle") {
      dispatch(fetchImagenes())
    }

    if (statusDescuentos === "idle") {
      dispatch(fetchDescuentos(1))
    }
  }, [dispatch, id, libroOriginal,statusGeneros,statusAutores,statusImagenes,statusDescuentos])

  useEffect(() => {
    if (!libroOriginal) return

    const generoActual    = generos.find(g => g.nombre === libroOriginal.genero)
    const editorialActual = editoriales.find(e => e.nombre === libroOriginal.editorial)
    const autorActual     = autores.find(a =>
      libroOriginal.autores?.[0] === `${a.nombre} ${a.apellido}`.trim()
    )
    const descuentoActual = descuentos
      .filter(d => d.activo)
      .find(d => d.porcentaje === libroOriginal.porcentajeDescuento)
    const imagenActual = imagenes.find(img =>
      img.file && libroOriginal.imagen &&
      img.file.substring(0, 30) === libroOriginal.imagen.substring(0, 30)
    )

    setForm({
      titulo:      libroOriginal.titulo || "",
      descripcion: libroOriginal.descripcion || "",
      paginas:     libroOriginal.paginas?.toString() ?? "0",
      precio:      libroOriginal.precio || "",
      stock:       "0",
      genero:      generoActual?.id?.toString() || "",
      editorial:   editorialActual?.id?.toString() || "",
      autores:     autorActual?.id?.toString() || "",
      imagenId:    imagenActual?.id?.toString() || "",
      descuento:   descuentoActual?.idDescuento?.toString() || descuentoActual?.id?.toString() || "",
    })
  }, [libroOriginal, generos, autores, imagenes, descuentos, editoriales])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.titulo.trim())         e.titulo    = "El título es obligatorio"
    if (!String(form.precio).trim()) e.precio    = "Ingresá un precio"
    if (!form.genero)                e.genero    = "Seleccioná un género"
    if (!form.editorial)             e.editorial = "Seleccioná una editorial"
    if (!form.descuento)             e.descuento = "Seleccioná un descuento"
    return e
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(editarLibro({ id, form, libroOriginal, generos, editoriales }))
      .then(() => {
        setUpdated(true)
        setTimeout(() => setUpdated(false), 3000)
      })
  }

  const handleCancel = () => navigate("/admin/libros")

  if (!libroOriginal) {
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
            <p className="text-sm text-gray-400 mt-1">Modificá los detalles de la obra literaria.</p>
          </div>

          {updated && (
            <Alerta texto="¡Libro actualizado correctamente!" onClose={() => setUpdated(false)} icono={false} />
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
                    <option key={g.id} value={g.id}>{g.nombre}</option>
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
                  <option key={a.id} value={a.id}>
                    {`${a.nombre} ${a.apellido}`.trim()}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Portada">
              <select name="imagenId" value={form.imagenId} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} disabled={guardando}>
                <option value="">Seleccionar portada</option>
                {imagenes.map(img => (
                  <option key={img.id} value={img.id}>
                    {img.name || `Portada: ${img.id}`}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Descuento">
              <select name="descuento" value={form.descuento} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} disabled={guardando}>
                <option value="">Seleccionar descuento</option>
                {descuentos.filter(d => d.activo).map(d => (
                  <option key={d.id} value={d.id}>{d.porcentaje}%</option>
                ))}
              </select>
              {errors.descuento && <p className="text-xs text-red-500 mt-0.5">{errors.descuento}</p>}
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