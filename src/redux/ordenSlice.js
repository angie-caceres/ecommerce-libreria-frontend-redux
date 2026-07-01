import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002";

// Thunks usuario
export const obtenerMisOrdenes = createAsyncThunk(
  "orden/obtenerMisOrdenes",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/ordenes/usuario/me`);
    return data;
  }
);

export const obtenerDetalleOrden = createAsyncThunk(
  "orden/obtenerDetalleOrden",
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/ordenes/${id}`);
    return data;
  }
);

// Thunks admin
export const fetchPedidos = createAsyncThunk(
  "orden/fetchPedidos",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/ordenes`);
    return data.map((pedido) => ({
      idOrden: pedido.idOrden,
      nombreUsuario: pedido.nombreUsuario,
      emailUsuario: pedido.emailUsuario,
      productos: pedido.productos,
      total: pedido.total,
      estado: pedido.estado,
    }));
  }
);

export const cancelarPedido = createAsyncThunk(
  "orden/cancelarPedido",
  async (idOrden) => {
    await axios.patch(`${BASE_URL}/ordenes/${idOrden}/cancelar`);
    return idOrden;
  }
);

const ordenSlice = createSlice({
  name: "orden",
  initialState: {
    // Usuario
    ordenes: [],
    ordenSeleccionada: null,
    statusUsuario: "idle",

    // Admin
    todos: [],
    statusAdmin: "idle",

    loading: false,
    error: null,
  },
  reducers: {
    limpiarOrdenes: (state) => {
      state.ordenes = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // obtenerMisOrdenes
      .addCase(obtenerMisOrdenes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusUsuario = "loading";
      })
      .addCase(obtenerMisOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.statusUsuario = "succeeded";
        state.ordenes = action.payload;
      })
      .addCase(obtenerMisOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.statusUsuario = "failed";
        state.error = action.error.message;
      })

      // obtenerDetalleOrden — no toca statusUsuario
      .addCase(obtenerDetalleOrden.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.ordenSeleccionada = null;
      })
      .addCase(obtenerDetalleOrden.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenSeleccionada = action.payload;
      })
      .addCase(obtenerDetalleOrden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ordenSeleccionada = null;
      })

      // fetchPedidos (admin)
      .addCase(fetchPedidos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusAdmin = "loading";
      })
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.loading = false;
        state.statusAdmin = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchPedidos.rejected, (state, action) => {
        state.loading = false;
        state.statusAdmin = "failed";
        state.error = action.error.message;
      })

      // cancelarPedido — no toca statusAdmin
      .addCase(cancelarPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarPedido.fulfilled, (state, action) => {
        state.loading = false;
        const pedido = state.todos.find((p) => p.idOrden === action.payload);
        if (pedido) {
          pedido.estado = "CANCELADA";
        }
      })
      .addCase(cancelarPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { limpiarOrdenes } = ordenSlice.actions;
export default ordenSlice.reducer;