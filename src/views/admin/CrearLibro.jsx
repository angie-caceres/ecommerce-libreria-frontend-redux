// VISTA — crear libro del panel admin con Redux
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import EncabezadoSeccion from "../../components/EncabezadoSeccion";
import Alerta from "../../components/Alerta";
import { useNavigate } from "react-router-dom";

import { fetchGeneros } from "../../redux/generosSlice";
import { fetchEditoriales } from "../../redux/editorialesSlice";
import { fetchAutores } from "../../redux/autoresSlice";
import { fetchImagenes } from "../../redux/imagenesSlice";
import { fetchDescuentos } from "../../redux/descuentosSlice";
import { crearLibro, asignarImagenLibro } from "../../redux/librosSlice";

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

const formInicial = {
  titulo: "",
  descripcion: "",
  paginas: "",
  precio: "",
  stock: "",
  genero: "",
  editorial: "",
  autores: "",
  imagenId: "",
  descuento: "",
};

export default function CrearLibro() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(formInicial);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorLocal, setErrorLocal] = useState(null);

  const { items: generos = [] } = useSelector((state) => state.generos);
  const { items: editoriales = [] } = useSelector((state) => state.editoriales);
  const { items: autores = [] } = useSelector((state) => state.autores);
  const { items: imagenes = [] } = useSelector((state) => state.imagenes);

  const {
    lista: descuentos = [],
  } = useSelector((state) => state.descuentos);

  const {
    loading: cargando,
    error,
  } = useSelector((state) => state.libros);

  useEffect(() => {
    dispatch(fetchGeneros());
    dispatch(fetchEditoriales());
    dispatch(fetchAutores());
    dispatch(fetchImagenes());
    dispatch(fetchDescuentos(1));
  }, [dispatch]);

  const descuentosActivos = descuentos.filter((d) => d.activo);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSubmitted(false);
    setErrorLocal(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio";
    if (!form.precio.trim()) newErrors.precio = "Ingresá un precio";
    if (!form.stock.trim()) newErrors.stock = "Ingresá el stock";
    if (!form.genero) newErrors.genero = "Seleccioná un género";
    if (!form.editorial) newErrors.editorial = "Seleccioná una editorial";
    if (!form.descuento) newErrors.descuento = "Seleccioná un descuento";

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrorLocal(null);

    const libroBody = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      paginas: parseInt(form.paginas) || 0,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      idGenero: parseInt(form.genero),
      idEditorial: parseInt(form.editorial),
      idAutores: form.autores ? [parseInt(form.autores)] : [],
      idDescuento: parseInt(form.descuento),
    };

    const resultado = await dispatch(crearLibro(libroBody));

    if (crearLibro.fulfilled.match(resultado)) {
      const libroCreado = resultado.payload;

      if (form.imagenId && libroCreado?.idLibro) {
        await dispatch(
          asignarImagenLibro({
            idLibro: libroCreado.idLibro,
            imagenId: form.imagenId,
          })
        );
      }

      setForm(formInicial);
      setErrors({});
      setSubmitted(true);
    } else {
      setErrorLocal("No se pudo crear el libro en el servidor.");
    }
  };

  const handleCancel = () => {
    setForm(formInicial);
    setErrors({});
    setSubmitted(false);
    setErrorLocal(null);
    navigate("/admin/libros");
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-serif">
      <Sidebar />

      <div className="ml-56 min-h-screen flex flex-col">
        <HeaderAdmin />

        <main className="flex-1 p-8 space-y-6">
          <EncabezadoSeccion titulo="Crear Libro" />

          {submitted && (
            <Alerta texto="¡Libro creado correctamente!" onClose={handleCancel} />
          )}

          {(errorLocal || error) && (
            <p className="text-center text-red-500 font-bold tracking-wide py-2 bg-red-50 border border-red-200 rounded-xl">
              ⚠️ {errorLocal || error}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <FormField label="Título del libro">
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Don Quijote de la Mancha"
                className={inputClass}
                disabled={cargando}
              />
              {errors.titulo && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.titulo}
                </p>
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
                disabled={cargando}
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
                  disabled={cargando}
                />
              </FormField>

              <FormField label="Precio (ARS)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-7`}
                    disabled={cargando}
                  />
                </div>
                {errors.precio && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.precio}
                  </p>
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
                  disabled={cargando}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.stock}
                  </p>
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
                  disabled={cargando}
                >
                  <option value="">Seleccionar género</option>
                  {generos.map((g) => (
                    <option key={g.idGenero || g.id} value={g.idGenero || g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {errors.genero && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.genero}
                  </p>
                )}
              </FormField>

              <FormField label="Editorial">
                <select
                  name="editorial"
                  value={form.editorial}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  disabled={cargando}
                >
                  <option value="">Seleccionar editorial</option>
                  {editoriales.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
                {errors.editorial && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.editorial}
                  </p>
                )}
              </FormField>
            </div>

            <FormField label="Autores" className="mt-5">
              <select
                name="autores"
                value={form.autores}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
                disabled={cargando}
              >
                <option value="">Seleccionar autor</option>
                {autores.map((a) => (
                  <option key={a.idAutor || a.id} value={a.idAutor || a.id}>
                    {`${a.nombre} ${a.apellido || ""}`.trim()}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Portada" className="mt-5">
              <select
                name="imagenId"
                value={form.imagenId}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
                disabled={cargando}
              >
                <option value="">Seleccionar portada</option>
                {imagenes.map((img) => (
                  <option key={img.id} value={img.id}>
                    {img.name || img.nombreArchivo || `Portada: ${img.id}`}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Descuento" className="mt-5">
              <select
                name="descuento"
                value={form.descuento}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
                disabled={cargando}
              >
                <option value="">Seleccionar descuento</option>
                {descuentosActivos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.porcentaje}%
                  </option>
                ))}
              </select>
              {errors.descuento && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.descuento}
                </p>
              )}
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#473954] rounded-xl hover:bg-[#3A3074] active:scale-95 transition-all shadow-sm"
              disabled={cargando}
            >
              {cargando ? "GUARDANDO..." : "CREAR LIBRO"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}