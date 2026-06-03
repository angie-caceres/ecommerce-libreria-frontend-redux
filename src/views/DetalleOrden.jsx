import { useParams, useNavigate } from "react-router-dom";

function DetalleOrden() {

  // Obtiene el ID de la orden desde la URL.
  const { id } = useParams();

  // Hook para navegar entre rutas.
  const navigate = useNavigate();

  // Datos simulados.
  const ordenes = [
    {
      id: 1,
      codigo: "#149",
      fecha: "14 de mayo, 2026",
      estado: "ENTREGADO",
      libros: [
        {
          id: 1,
          titulo: "Principia Mathematica",
          autor: "Isaac Newton",
          imagen: "/principia.jpg",
          precio: 25000,
        },
        {
          id: 2,
          titulo: "Meditaciones",
          autor: "Marco Aurelio",
          imagen: "/meditaciones.jpg",
          precio: 18000,
        },
      ],
    },
    {
      id: 2,
      codigo: "#105",
      fecha: "28 de mayo, 2026",
      estado: "EN CAMINO",
      fechaEstimada: "8 de junio, 2026",
      libros: [
        {
          id: 3,
          titulo: "La Divina Comedia",
          autor: "Dante Alighieri",
          imagen: "/divina.jpg",
          precio: 22000,
        },
      ],
    },
  ];

  // Busca la orden correspondiente al ID recibido.
  const orden = ordenes.find((orden) => orden.id === Number(id));

  // Si la orden no existe, muestra un mensaje de error.
  if (!orden) {
    return (
      <main className="bg-[#FCF9F8] px-4 py-10 min-h-screen">
        <section className="max-w-6xl mx-auto">

          <h1 className="font-serif text-5xl text-[#351118]">
            Orden no encontrada
          </h1>

          <button
            onClick={() => navigate("/mis-ordenes")}
            className="mt-8 bg-[#4b385c] text-white px-6 py-3 hover:bg-[#382943] transition"
          >
            Volver a mis órdenes
          </button>

        </section>
      </main>
    );
  }

  // Calcula el total de la compra sumando el precio de cada libro.
  const total = orden.libros.reduce(
    (acumulador, libro) => acumulador + libro.precio,
    0
  );

  return (
    <main className="bg-[#FCF9F8] px-4 py-10 min-h-screen">
      <section className="max-w-6xl mx-auto">

        {/* Botón para volver al listado de órdenes */}
        <button
          onClick={() => navigate("/mis-ordenes")}
          className="mb-8 text-[#4b385c] hover:underline"
        >
          ← Volver a mis órdenes
        </button>

        {/* Título principal */}
        <h1 className="font-serif text-6xl text-[#351118]">
          Detalle de orden {orden.codigo}
        </h1>

        <p className="text-gray-500 mt-4 mb-10">
          Información completa de tu compra.
        </p>

        {/* Información general de la orden */}
        <div className="bg-white border border-[#eadbd6] p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div>
              <p className="text-xs uppercase text-gray-400">Código</p>
              <p className="text-2xl text-[#351118]">{orden.codigo}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Fecha</p>
              <p>{orden.fecha}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Estado</p>
              <p className="font-semibold text-[#b45f06]">{orden.estado}</p>
            </div>

            {/* Solo se muestra si la orden está en camino */}
            {orden.estado === "EN CAMINO" && (
              <div>
                <p className="text-xs uppercase text-gray-400">
                  Fecha estimada
                </p>
                <p>{orden.fechaEstimada}</p>
              </div>
            )}

          </div>
        </div>

        {/* Listado de libros comprados */}
        <div className="bg-white border border-[#eadbd6] p-8">

          <h2 className="font-serif text-3xl text-[#351118] mb-6">
            Libros comprados
          </h2>

          <div className="space-y-4">

            {/* Recorre todos los libros de la orden */}
            {orden.libros.map((libro) => (
              <div
                key={libro.id}
                className="flex items-center gap-5 bg-[#F8F4F2] p-5"
              >

                {/* Imagen del libro */}
                <img
                  src={libro.imagen}
                  alt={libro.titulo}
                  className="w-20 h-28 object-cover"
                />

                {/* Información del libro */}
                <div>
                  <h3 className="font-serif text-2xl text-[#351118]">
                    {libro.titulo}
                  </h3>
                  <p className="text-gray-500">{libro.autor}</p>
                </div>

                {/* Precio individual */}
                <div className="ml-auto text-right">
                  <p className="text-xs uppercase text-gray-400">Precio</p>
                  <p className="font-semibold text-[#351118]">
                    ${libro.precio.toLocaleString("es-AR")}
                  </p>
                </div>

              </div>
            ))}

          </div>

          {/* Total de la orden */}
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