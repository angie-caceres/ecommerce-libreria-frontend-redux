import OrdenCard from "../components/OrdenCard";
import Quote from "../components/Quote";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerMisOrdenes } from "../redux/misOrdenesSlice";

function MisOrdenes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ordenes, loading, error } = useSelector((state) => state.misOrdenes);

  useEffect(() => {
    dispatch(obtenerMisOrdenes());
  }, [dispatch]);

  return (
    <main className="bg-[#FCF9F8] px-4 py-10">
      <section className="max-w-6xl mx-auto">
        <h1 className="font-serif text-6xl text-[#351118]">
          Mis Órdenes
        </h1>

        <p className="text-gray-500 mt-4 mb-10 max-w-2xl">
          Explore la crónica de sus adquisiciones literarias.
        </p>

        {loading && (
          <p className="text-gray-500">Cargando órdenes...</p>
        )}

        {error && (
          <p className="text-red-600">
            Error al cargar las órdenes: {error}
          </p>
        )}

        {!loading && ordenes.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-lg">
              Todavía no has realizado ninguna compra.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {ordenes.map((orden) => (
              <OrdenCard
                key={orden.idOrden}
                codigo={`#${orden.idOrden}`}
                fecha={new Date(orden.fechaVenta).toLocaleDateString("es-AR")}
                estado={orden.estado}
                libros={(orden.items || []).map((item) => ({
                  id: item.idLibro,
                  titulo: item.tituloLibro,
                  imagen: item.imagen
                    ? `data:image/jpeg;base64,${item.imagen}`
                    : null,
                  autor: item.autor || "",
                }))}
                boton={
                  <button
                    onClick={() => navigate(`/mis-ordenes/${orden.idOrden}`)}
                    className="bg-[#4b385c] text-white px-6 py-3 hover:bg-[#382943] transition"
                  >
                    Ver detalles
                  </button>
                }
              />
            ))}
          </div>
        )}

        <div className="my-16">
          <Quote
            texto="Una casa sin libros es como un cuerpo sin alma."
            autor="Cicerón"
          />
        </div>
      </section>
    </main>
  );
}

export default MisOrdenes;