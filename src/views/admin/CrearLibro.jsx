import { useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";

// Datos simulados para géneros y editoriales
const GENEROS_MOCK = ["Fantasía", "Ciencia Ficción", "Romance", "Terror", "Historia", "Biografía", "Ensayo"];
const EDITORIALES_MOCK = ["Planeta", "Sudamericana", "Alfaguara", "Urano", "Siglo XXI", "FCE"];

// Campo reutilizable para formularios
function FormField({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}
// Estilos base reutilizables para todos los inputs
const inputClass =
  "w-full px-4 py-2.5 text-sm text-[#544341] bg-white border border-[#CBC4CE] rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-[#EBE5F2] focus:border-[#7B5B98] " +
  "placeholder:text-[#877270] transition-colors";

// ─────────────────────────────────────────────────────────────
// PRINCIPAL: CrearLibro
// ─────────────────────────────────────────────────────────────
export default function CrearLibro() {

// Datos del formulario
  const [form, setForm] = useState({
    titulo:      "",
    descripcion: "",
    paginas:     "",
    precio:      "",
    stock:       "",
    genero:      "",
    editorial:   "",
    autores:     "",
    imagenId:    "",
  });
  


  // Estados de validación y mensajes
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState({});

  // Actualiza los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpia el error de ese campo al escribir
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Verifica los campos obligatorios
    const validate = () => {
        const newErrors = {};

        if (!form.titulo.trim())
            newErrors.titulo = "El título es obligatorio";

        if (!form.precio.trim())
            newErrors.precio = "Ingresá un precio";

        if (!form.stock.trim())
            newErrors.stock = "Ingresá el stock";

        if (!form.genero)
            newErrors.genero = "Seleccioná un género";

        if (!form.editorial)
            newErrors.editorial = "Seleccioná una editorial";

        return newErrors;
    };

  // Procesa el envío del formulario
  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const payload = {
      ...form,
    };
    console.log("Libro a crear:", payload);
    setSubmitted(true);
  };

  // Restablece el formulario
  const handleCancel = () => {

    setForm({ titulo:"", descripcion:"", paginas:"", precio:"",
              stock:"", genero:"", editorial:"",
              autores:"", imagenId:"" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
        {/* Menú lateral */}
        <Sidebar />

        <div className="ml-56 min-h-screen flex flex-col">
            {/* Encabezado */}
            <HeaderAdmin />

            {/* Contenido principal */}
            <main className="flex-1 p-8">
          <h2
            className="text-4xl text-[#1C1B1B]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Crear Libro
          </h2>
          {/* Mensaje de confirmación */}
          {submitted && (
            <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
              <span>✅</span>
              <span>¡Libro creado correctamente! Podés ver el catálogo en Gestión de libros.</span>
              <button onClick={handleCancel} className="ml-auto text-emerald-500 hover:text-emerald-700">✕</button>
            </div>
          )}

         {/* Formulario de creación */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <FormField label="Título del libro">
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Don Quijote de la Mancha"
                className={inputClass}
              />
              {errors.titulo && (
                <p className="text-xs text-red-500 mt-0.5">{errors.titulo}</p>
              )}
            </FormField>

            <FormField label="Descripción" className="mt-5">
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Escribe una breve reseña..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </FormField>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

              <FormField label="Páginas">
                <input
                  type="number"
                  name="paginas"
                  value={form.paginas}
                  onChange={handleChange}
                  placeholder="452"
                  min="1"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Precio (ARS)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-7`}
                  />
                </div>
                {errors.precio && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.precio}</p>
                )}
            </FormField>
             <FormField label="Stock disponible">
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej: 50"
                min="0"
                className={inputClass}
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-0.5">{errors.stock}</p>
              )}
            </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

              <FormField label="Género">
               
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Seleccionar género</option>
                  {GENEROS_MOCK.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.genero && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.genero}</p>
                )}
              </FormField>

              <FormField label="Editorial">
                <select
                  name="editorial"
                  value={form.editorial}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Seleccionar editorial</option>
                  {EDITORIALES_MOCK.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                {errors.editorial && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.editorial}</p>
                )}
              </FormField>
            </div>
            <FormField label="Autores" className="mt-5">
              <input
                type="text"
                name="autores"
                value={form.autores}
                onChange={handleChange}
                placeholder="Agregar autor..."
                className={inputClass}
              />
              <p className="text-xs text-gray-400">Separar múltiples autores con coma</p>
            </FormField>

            {/* ── CAMPO: ID de imagen ──────────────────────── */}
            <FormField label="ID de imagen" className="mt-5">
              <input
                type="text"
                name="imagenId"
                value={form.imagenId}
                onChange={handleChange}
                placeholder="Ej: 1"
                className={inputClass}
              />
            </FormField>

          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#473954] rounded-xl hover:bg-[#3A3074] active:scale-95 transition-all shadow-sm"
            >
              CREAR LIBRO
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}