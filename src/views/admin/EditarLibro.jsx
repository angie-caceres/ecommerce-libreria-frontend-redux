import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import Alerta from "../../components/Alerta";

import { libros } from "../../data/libros";
const AUTORES_MOCK = [...new Set(libros.map(libro => libro.autor))].sort();
const GENEROS_MOCK = [...new Set(libros.map(libro => libro.categoria))].sort();

// 2. EDITORIALES: Extrae las editoriales, elimina duplicados y las ordena
const EDITORIALES_MOCK = [...new Set(libros.map(libro => libro.editorial))].sort();

// 3. PORTADAS 
const IMAGENES_MOCK = [...new Set(libros.map(libro => libro.imagen))].map((ruta, index) => {
  const nombreLimpio = ruta.split('/').pop(); 
  return {
    id: ruta, 
    nombre: `Portada ${nombreLimpio.split('.')[0]}` 
  };
});


{/*const IMAGENES_MOCK = [
  { id: 1, nombre: "Portada 1984" },
  { id: 2, nombre: "Portada El Hobbit" },
  { id: 3, nombre: "Portada Amanecer en la cosecha" },
];*/}

//const GENEROS_MOCK     = ["Fantasía", "Ciencia Ficción", "Romance", "Terror", "Historia", "Biografía", "Ensayo", "Clásicos Literarios", "CLÁSICOS MODERNOS", "DISTOPÍA", "FANTASÍA", "CLÁSICO", "INFANTIL"];
//const EDITORIALES_MOCK = ["Planeta", "Sudamericana", "Alfaguara", "Urano", "Siglo XXI", "FCE", "L'Atelier Press", "Penguin", "Minotauro", "Salamandra"];
//const AUTORES_MOCK     = ["Suzanne Collins", "George Orwell"];

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
  "w-full px-4 py-2.5 text-sm text-[#544341] bg-white border border-[#CBC4CE] rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-[#EBE5F2] focus:border-[#7B5B98] " +
  "placeholder:text-[#877270] transition-colors";


// ─────────────────────────────────────────────────────────────
// PRINCIPAL: EditarLibro
// ─────────────────────────────────────────────────────────────
export default function EditarLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const libroActual = libros.find(
    (libro) => libro.id === Number(id)
  );

  const [form, setForm] = useState({
    titulo: libroActual?.titulo || "",
    descripcion: libroActual?.descripcion || "", 
    paginas: libroActual?.hojas || "",         
    precio: libroActual?.precioOriginal || "",
    genero: libroActual?.categoria || "",       
    editorial: libroActual?.editorial || "",    
    autores: libroActual?.autor || "",
    imagenId: libroActual?.imagen || "",
  });

  const [stock, setStock] = useState(0);

  const [updated, setUpdated]         = useState(false);
  const [errors, setErrors]           = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  
  const incrementStock = () => setStock(s => s + 1);
  const decrementStock = () => setStock(s => Math.max(0, s - 1));

  // Verifica los campos obligatorios
    const validate = () => {
        const e = {};

        if (!form.titulo.trim())
            e.titulo = "El título es obligatorio";

        if (!String(form.precio).trim())
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

    const payload = { ...form, stock };
    console.log("Libro actualizado:", payload);

    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

const handleCancel = () => {
    navigate("/admin/libros");
  };

  const estadoInventario = stock > 0 ? "EN CATÁLOGO" : "SIN STOCK";
  const estadoColor      = stock > 0
    ? "bg-amber-100 text-amber-700 border border-amber-200"
    : "bg-red-100 text-red-700 border border-red-200";

  return (
  <div className="min-h-screen bg-[#f7f4ef] font-serif">

    {/* Menú lateral */}
    <Sidebar />

    <div className="ml-56 min-h-screen flex flex-col">

      {/* Encabezado */}
      <HeaderAdmin />

      {/* Contenido principal */}
      <main className="flex-1 p-8 space-y-6">

        {/* Encabezado de la página */}
        <div>
          <h2
            className="text-4xl text-[#1C1B1B]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Editar Libro
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Modifica los detalles de la obra literaria.
          </p>
        </div>

          {updated && (
            <Alerta
              texto="¡Libro actualizado correctamente!"
              onClose={() => setUpdated(false)}
              icono={false}
            />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Género">
                  <select name="genero" value={form.genero} onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Seleccionar género</option>
                    {GENEROS_MOCK.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.genero && <p className="text-xs text-red-500">{errors.genero}</p>}
                </FormField>

                <FormField label="Editorial">
                  <select name="editorial" value={form.editorial} onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Seleccionar editorial</option>
                    {EDITORIALES_MOCK.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {errors.editorial && <p className="text-xs text-red-500">{errors.editorial}</p>}
                </FormField>
              </div>

              <FormField label="Autores">
                <select
                  name="autores"
                  value={form.autores}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Seleccionar autor</option>
                  {AUTORES_MOCK.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Portada">
                <select
                  name="imagenId"
                  value={form.imagenId}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Seleccionar portada</option>

                  {IMAGENES_MOCK.map((imagen) => (
                    <option key={imagen.id} value={imagen.id}>
                      {imagen.nombre}
                    </option>
                  ))}
                </select>
              </FormField>

            </div>

          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#473954] rounded-xl hover:bg-[#3A3074] active:scale-95 transition-all shadow-sm">
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