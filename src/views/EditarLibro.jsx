import { useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/Sidebar";
import { DESCUENTOS_MOCK } from "./CrearDescuento";

const LIBRO_MOCK = {
  titulo:      "Cien años de soledad",
  descripcion: "La obra maestra de Gabriel García Márquez, un hito del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
  paginas:     "356",
  precio:      "12500.00",
  descuentoId:   "10",
  stock:       24,
  genero:      "Clásicos Literarios",
  editorial:   "L'Atelier Press",
  autores:     ["Gabriel García Márquez"],
  portada:     "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg",
};

const GENEROS_MOCK    = ["Fantasía", "Ciencia Ficción", "Romance", "Terror", "Historia", "Biografía", "Ensayo", "Clásicos Literarios"];
const EDITORIALES_MOCK = ["Planeta", "Sudamericana", "Alfaguara", "Urano", "Siglo XXI", "FCE", "L'Atelier Press"];

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

const inputClass =
  "w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 " +
  "placeholder:text-gray-300 transition-colors";


// ─────────────────────────────────────────────────────────────
// PRINCIPAL: EditarLibro
// ─────────────────────────────────────────────────────────────
export default function EditarLibro() {

  const [form, setForm] = useState({
    titulo:      LIBRO_MOCK.titulo,
    descripcion: LIBRO_MOCK.descripcion,
    paginas:     LIBRO_MOCK.paginas,
    precio:      LIBRO_MOCK.precio,
    descuentoId:   "1",
    genero:      LIBRO_MOCK.genero,
    editorial:   LIBRO_MOCK.editorial,
  });

  const [stock, setStock] = useState(LIBRO_MOCK.stock);
  const [autores, setAutores]       = useState(LIBRO_MOCK.autores);
  const [autorInput, setAutorInput] = useState("");

  const [updated, setUpdated]         = useState(false);
  const [errors, setErrors]           = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  
  const incrementStock = () => setStock(s => s + 1);
  const decrementStock = () => setStock(s => Math.max(0, s - 1));

  const agregarAutor = () => {
    const nombre = autorInput.trim();
    if (!nombre || autores.includes(nombre)) return;
  
    setAutores(prev => [...prev, nombre]);
    setAutorInput("");
  };

  const eliminarAutor = (nombre) => {
   
    setAutores(prev => prev.filter(a => a !== nombre));
  };
  // Permite agregar autores con la tecla Enter
    const handleAutorKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarAutor();
        }
    };

  // Verifica los campos obligatorios
    const validate = () => {
        const e = {};

        if (!form.titulo.trim())
            e.titulo = "El título es obligatorio";

        if (!form.precio.trim())
            e.precio = "Ingresá un precio";

        if (!form.genero)
            e.genero = "Seleccioná un género";

        if (!form.editorial)
            e.editorial = "Seleccioná una editorial";

        return e;
    };

  const handleSubmit = () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    const payload = { ...form, stock, autores };

    console.log("Libro actualizado:", payload);

    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
    };

  const handleCancel = () => {
    setForm({
      titulo: LIBRO_MOCK.titulo, descripcion: LIBRO_MOCK.descripcion,
      paginas: LIBRO_MOCK.paginas, precio: LIBRO_MOCK.precio,
      descuentoId: "1", genero: LIBRO_MOCK.genero,
      editorial: LIBRO_MOCK.editorial,
    });
    setStock(LIBRO_MOCK.stock);
    setAutores(LIBRO_MOCK.autores);
    setErrors({});
  };

  const estadoInventario = stock > 0 ? "EN CATÁLOGO" : "SIN STOCK";
  const estadoColor      = stock > 0
    ? "bg-amber-100 text-amber-700 border border-amber-200"
    : "bg-red-100 text-red-700 border border-red-200";

  return (
  <div className="min-h-screen bg-[#f7f4ef] font-sans">

    {/* Menú lateral */}
    <Sidebar />

    <div className="ml-56 min-h-screen flex flex-col">

      {/* Encabezado */}
      <HeaderAdmin />

      {/* Contenido principal */}
      <main className="flex-1 p-8 space-y-6">

        {/* Encabezado de la página */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Editar Libro
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Modifica los detalles de la obra literaria.
          </p>
        </div>

          {updated && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
              <span>✅</span>
              <span>¡Libro actualizado correctamente!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

              <FormField label="Título del libro">
                <input type="text" name="titulo"
                  value={form.titulo} onChange={handleChange}
                  className={inputClass} />
                {errors.titulo && <p className="text-xs text-red-500">{errors.titulo}</p>}
              </FormField>

              <FormField label="Descripción">
                <textarea name="descripcion"
                  value={form.descripcion} onChange={handleChange}
                  rows={5} className={`${inputClass} resize-none`} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Páginas">
                  <input type="number" name="paginas"
                    value={form.paginas} onChange={handleChange}
                    min="1" className={inputClass} />
                </FormField>

                <FormField label="Precio (ARS)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input type="number" name="precio"
                      value={form.precio} onChange={handleChange}
                      min="0" step="0.01" className={`${inputClass} pl-7`} />
                  </div>
                  {errors.precio && <p className="text-xs text-red-500">{errors.precio}</p>}
                </FormField>

                <FormField label="Descuento">
                    <select
                        name="descuentoId"
                        value={form.descuentoId}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none cursor-pointer`}
                    >
                        <option value="">Seleccionar descuento</option>

                        {DESCUENTOS_MOCK.map((descuento) => (
                            <option key={descuento.id} value={descuento.id}>
                                {descuento.nombre} - {descuento.porcentaje}%
                            </option>
                         ))}
                    </select>
                </FormField>
              </div>

              <FormField label="Stock disponible">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementStock}
                    className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 text-lg font-bold transition-colors border-r border-gray-200">
                    −
                  </button>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 text-center text-sm font-semibold text-gray-700 py-2.5 border-0 focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={incrementStock}
                    className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 text-lg font-bold transition-colors border-l border-gray-200">
                    +
                  </button>
                </div>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Género">
                  <select name="genero" value={form.genero} onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    {GENEROS_MOCK.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.genero && <p className="text-xs text-red-500">{errors.genero}</p>}
                </FormField>

                <FormField label="Editorial">
                  <select name="editorial" value={form.editorial} onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    {EDITORIALES_MOCK.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {errors.editorial && <p className="text-xs text-red-500">{errors.editorial}</p>}
                </FormField>
              </div>

              <FormField label="Autores">
                <div className={`${inputClass} flex flex-wrap gap-2 min-h-[44px] cursor-text`}>
                  {autores.map((autor) => (
                    <span key={autor}
                      className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {autor}

                      <button onClick={() => eliminarAutor(autor)}
                        className="hover:text-purple-900 font-bold leading-none">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={autorInput}
                    onChange={(e) => setAutorInput(e.target.value)}
                    onKeyDown={handleAutorKeyDown}
                    onBlur={agregarAutor}
                    placeholder={autores.length === 0 ? "Agregar autor..." : ""}
                    className="flex-1 min-w-[120px] border-0 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                  />
                </div>
                <p className="text-xs text-gray-400">Presioná Enter para agregar un autor</p>
              </FormField>

            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Portada</p>
              {LIBRO_MOCK.portada ? (
                <img
                  src={LIBRO_MOCK.portada}
                  alt={`Portada de ${form.titulo}`}
                  className="w-full rounded-xl object-cover shadow-sm"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-4xl">
                  📚
                </div>
              )}
            </div>

          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-purple-900 rounded-xl hover:bg-purple-800 active:scale-95 transition-all shadow-sm">
              Actualizar Libro
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-700">Estado del inventario</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Stock</span>
                <span className="text-sm font-bold text-gray-800">{stock} unidades</span>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Estado</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${estadoColor}`}>
                  {estadoInventario}
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}