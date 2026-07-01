import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ResumenCompra from "../components/ResumenCompra";
import {
  fetchCarrito,
  eliminarItemCarrito,
  incrementarItemCarrito,
  decrementarItemCarrito,
  vaciarCarritoBackend,
  limpiarAviso,
} from "../redux/carritoSlice";

function Carrito({ eliminarDelCarrito, vaciarCarrito }) {
  const dispatch = useDispatch();

  const {
    items,
    loading: cargando,
    error,
    aviso,
    status,
  } = useSelector((state) => state.carrito);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCarrito())
  }, [dispatch, status]);

  const handleEliminar = async (id) => {
    const itemToRemove = items.find((i) => i.id === id);

    const resultado = await dispatch(eliminarItemCarrito(id));

    if (eliminarItemCarrito.fulfilled.match(resultado)) {
      eliminarDelCarrito(itemToRemove?.idLibro);
    }
  };

  const handleIncrementar = async (id) => {
    dispatch(limpiarAviso());
    await dispatch(incrementarItemCarrito(id));
  };

  const handleDecrementar = async (id) => {
    dispatch(limpiarAviso());

    const itemToRemove = items.find((i) => i.id === id);
    const resultado = await dispatch(decrementarItemCarrito(id));

    if (
      decrementarItemCarrito.fulfilled.match(resultado) &&
      !resultado.payload.data
    ) {
      eliminarDelCarrito(itemToRemove?.idLibro);
    }
  };

  const handleVaciarCarrito = async () => {
    const resultado = await dispatch(vaciarCarritoBackend());

    if (vaciarCarritoBackend.fulfilled.match(resultado)) {
      vaciarCarrito();
    }
  };

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-8">
      <h1
        className="text-3xl font-bold text-[#4E3B67] mb-8"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Mi Carrito
      </h1>

      {cargando && (
        <p className="text-center text-gray-400 text-sm uppercase tracking-widest mt-20">
          Cargando carrito...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 text-sm uppercase tracking-widest mt-20">
          {error}
        </p>
      )}

      {!cargando && !error && (
        items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
            <Link
              to="/catalogo"
              className="bg-[#2d2640] text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {aviso && (
              <p className="text-center text-red-400 text-sm uppercase tracking-widest mb-4">
                {aviso}
              </p>
            )}

            <ResumenCompra
              carrito={items}
              titulo="Mi Carrito"
              editable={true}
              mostrarEnvio={false}
              cambiarCantidad={(id, cantidad) => {
                const item = items.find((i) => i.id === id);

                if (cantidad > item?.cantidad) {
                  handleIncrementar(id);
                } else {
                  handleDecrementar(id);
                }
              }}
              eliminarDelCarrito={handleEliminar}
            />

            <button
              onClick={handleVaciarCarrito}
              className="w-full border border-red-300 text-red-400 py-3 text-sm uppercase tracking-widest hover:bg-red-50 transition mt-4"
            >
              Vaciar carrito
            </button>

            <Link
              to="/checkout"
              className="w-full bg-[#2d2640] text-white py-3 text-sm uppercase tracking-widest hover:bg-purple-800 transition mt-4 flex items-center justify-center gap-2"
            >
              Checkout →
            </Link>
          </div>
        )
      )}
    </div>
  );
}

export default Carrito;