import OrdenCard from "../components/OrdenCard";
import Quote from "../components/Quote";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MisOrdenes({ usuario }) {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  useEffect(() => {
    const obtenerOrdenes = async () => {
      const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");

      const response = await fetch("http://localhost:4002/ordenes/usuario/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        console.log("ORDENES:", data);

        setOrdenes(data);
      }
    };

    obtenerOrdenes();
  }, []);

  return (
    <main className="bg-[#FCF9F8] px-4 py-10">

      <section className="max-w-6xl mx-auto">

        <h1 className="font-serif text-6xl text-[#351118]">
          Mis Órdenes
        </h1>

        <p className="text-gray-500 mt-4 mb-10 max-w-2xl">
          Explore la crónica de sus adquisiciones literarias.
        </p>

        {ordenes.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-lg">
              Todavía no has realizado ninguna compra.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {ordenes.map((orden) => {
              console.log("ORDEN:", orden)

              return (
                <OrdenCard
                  key={orden.idOrden}
                  codigo={`#${orden.idOrden}`}
                  fecha={new Date(orden.fechaVenta).toLocaleDateString("es-AR")}
                  estado={orden.estado}
                  libros={(orden.items || []).map(item => ({
                    id: item.idLibro,
                    titulo: item.tituloLibro,
                    imagen: item.imagen
                      ? `data:image/jpeg;base64,${item.imagen}`
                      : null,
                    autor: item.autor || ""
                  }))}
                  boton={
                    <button
                      onClick={() => {
                        console.log("ID ORDEN:", orden.idOrden)
                        navigate(`/mis-ordenes/${orden.idOrden}`)
                      }}
                      className="bg-[#4b385c] text-white px-6 py-3 hover:bg-[#382943] transition"
                    >
                      Ver detalles
                    </button>
                  }
                />
              )
            })}
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