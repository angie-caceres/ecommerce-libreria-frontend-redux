// VISTA — pantalla de confirmación luego del checkout
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ResumenCompra from "../components/ResumenCompra";
import Quote from "../components/Quote";

function ConfirmacionPedido() {
  const { state } = useLocation();

  const ordenConfirmada = useSelector(
    (stateRedux) => stateRedux.carrito.ordenConfirmada
  );

  const itemsConfirmados = useSelector(
  (stateRedux) => stateRedux.carrito.itemsConfirmados
);

const carrito = state?.items ?? itemsConfirmados ?? [];

  const orden = state?.orden ?? ordenConfirmada;

  return (
    <div className="bg-[#FCF9F8] min-h-screen">
      <div className="px-12 py-12 max-w-4xl mx-auto">
        <h1
          className="text-5xl text-center text-[#4E3B67] mb-12"
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          Resumen de compra
        </h1>

        {carrito.length === 0 && !orden ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-6">
              No hay una compra confirmada para mostrar.
            </p>

            <Link
              to="/catalogo"
              className="bg-[#2d2640] text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <ResumenCompra
            carrito={carrito}
            titulo="Resumen de Compra"
            editable={false}
            mostrarEnvio={true}
            mostrarBoton={false}
            confirmado={true}
          />
        )}
      </div>

      <div className="flex items-center gap-4 px-12 my-8 max-w-4xl mx-auto">
        <div className="flex-1 border-t border-gray-200"></div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>

        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <Quote />
    </div>
  );
}

export default ConfirmacionPedido;