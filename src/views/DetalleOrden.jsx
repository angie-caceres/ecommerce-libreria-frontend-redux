import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DetalleOrden() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerOrden = async () => {
      const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");

      const response = await fetch(`http://localhost:4002/ordenes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrden(data);
      }

      setCargando(false);
    };

    obtenerOrden();
  }, [id]);

  if (cargando) return <p>Cargando orden...</p>;

  if (!orden) {
    return (
      <main className="bg-[#FCF9F8] px-4 py-10 min-h-screen">
        <section className="max-w-6xl mx-auto">
          <h1 className="font-serif text-5xl text-[#351118]">
            Orden no encontrada
          </h1>
          <button
            onClick={() => navigate("/mis-ordenes")}
            className="mt-8 bg-[#4b385c] text-white px-6 py-3"
          >
            Volver a mis órdenes
          </button>
        </section>
      </main>
    );
  }

  const libros = orden.items || [];
  const total = orden.total || 0;

  return (
    <main className="bg-[#FCF9F8] px-4 py-10 min-h-screen">
      <section className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate("/mis-ordenes")}
          className="mb-8 text-[#4b385c] hover:underline"
        >
          ← Volver a mis órdenes
        </button>

        <h1 className="font-serif text-6xl text-[#351118]">
          Detalle de orden #{orden.idOrden}
        </h1>

        <p className="text-gray-500 mt-4 mb-10">
          Información completa de tu compra.
        </p>

        <div className="bg-white border border-[#eadbd6] p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs uppercase text-gray-400">Código</p>
              <p className="text-2xl text-[#351118]">#{orden.idOrden}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Fecha</p>
              <p>{new Date(orden.fechaVenta).toLocaleDateString("es-AR")}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Estado</p>
              <p className="font-semibold text-[#b45f06]">{orden.estado}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Pago</p>
              <p>{orden.metodoPago}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#eadbd6] p-8">
          <h2 className="font-serif text-3xl text-[#351118] mb-6">
            Libros comprados
          </h2>

          <div className="space-y-4">
            {libros.map((item) => (
              <div
                key={item.idItemOrden}
                className="flex items-center gap-5 bg-[#F8F4F2] p-5"
              >
                {item.imagen && (
                  <img
                    src={`data:image/jpeg;base64,${item.imagen}`}
                    alt={item.tituloLibro}
                    className="w-20 h-28 object-cover"
                  />
                )}

                <div>
                  <h3 className="font-serif text-2xl text-[#351118]">
                    {item.tituloLibro}
                  </h3>
                  <p className="text-gray-500">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-xs uppercase text-gray-400">Subtotal</p>
                  <p className="font-semibold text-[#351118]">
                    ${item.subtotal?.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-5 flex justify-between text-xl font-semibold text-[#351118]">
            <span>Total</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DetalleOrden;