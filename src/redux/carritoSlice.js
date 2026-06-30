import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002";

const formatearItem = (item) => ({
  id: item.idItemCarrito,
  idLibro: item.idLibro,
  titulo: item.tituloLibro,
  imagen: item.imagen ? `data:image/jpeg;base64,${item.imagen}` : null,
  precio: item.precioUnitario,
  cantidad: item.cantidad,
  subtotal: item.subtotal,
});

export const fetchCarrito = createAsyncThunk(
  "carrito/fetchCarrito",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/carrito`);
    return data.items.map(formatearItem);
  }
);

export const eliminarItemCarrito = createAsyncThunk(
  "carrito/eliminarItem",
  async (idItem) => {
    await axios.delete(`${BASE_URL}/carrito/items/${idItem}`);
    return idItem;
  }
);

export const incrementarItemCarrito = createAsyncThunk(
  "carrito/incrementarItem",
  async (idItem) => {
    const { data } = await axios.put(`${BASE_URL}/carrito/items/${idItem}/incrementar`);
    return { idItem, data };
  }
);

export const decrementarItemCarrito = createAsyncThunk(
  "carrito/decrementarItem",
  async (idItem) => {
    const { data } = await axios.put(`${BASE_URL}/carrito/items/${idItem}/decrementar`);
    return { idItem, data };
  }
);

export const vaciarCarritoBackend = createAsyncThunk(
  "carrito/vaciarCarrito",
  async () => {
    await axios.delete(`${BASE_URL}/carrito/items`);
  }
);

export const confirmarCompra = createAsyncThunk(
  "carrito/confirmarCompra",
  async (metodoPago) => {
    const { data } = await axios.post(`${BASE_URL}/carrito/checkout`, {
      metodoPago,
    });

    return data;
  }
);
const carritoSlice = createSlice({
  name: "carrito",
  initialState: {
    items: [],
    loading: false,
    error: null,
    aviso: null,
    ordenConfirmada: null,
    itemsConfirmados: [],
  },
  reducers: {
    limpiarAviso: (state) => {
      state.aviso = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarrito.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo cargar el carrito.";
      })

      .addCase(eliminarItemCarrito.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(eliminarItemCarrito.rejected, (state) => {
        state.error = "No se pudo eliminar el item.";
      })

      .addCase(incrementarItemCarrito.fulfilled, (state, action) => {
        const { idItem, data } = action.payload;

        const item = state.items.find((item) => item.id === idItem);
        if (item) {
          item.cantidad = data.cantidad;
          item.subtotal = data.subtotal;
        }
      })
      .addCase(incrementarItemCarrito.rejected, (state, action) => {
        state.aviso = action.error.message || "No se pudo actualizar el item.";
      })

      .addCase(decrementarItemCarrito.fulfilled, (state, action) => {
        const { idItem, data } = action.payload;

        if (!data) {
          state.items = state.items.filter((item) => item.id !== idItem);
        } else {
          const item = state.items.find((item) => item.id === idItem);
          if (item) {
            item.cantidad = data.cantidad;
            item.subtotal = data.subtotal;
          }
        }
      })
      .addCase(decrementarItemCarrito.rejected, (state) => {
        state.error = "No se pudo actualizar el item.";
      })

      .addCase(vaciarCarritoBackend.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(vaciarCarritoBackend.rejected, (state) => {
        state.error = "No se pudo vaciar el carrito.";
      })
      .addCase(confirmarCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmarCompra.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenConfirmada = action.payload;
        state.itemsConfirmados = state.items;
        state.items = [];
      })
      .addCase(confirmarCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "No se pudo confirmar la compra.";
      });
  },
});

export const { limpiarAviso } = carritoSlice.actions;
export default carritoSlice.reducer;