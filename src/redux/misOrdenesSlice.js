import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002";
export const obtenerDetalleOrden = createAsyncThunk(
  "misOrdenes/obtenerDetalleOrden",
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/ordenes/${id}`);
    return data;
  }
);
export const obtenerMisOrdenes = createAsyncThunk(
  "misOrdenes/obtenerMisOrdenes",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/ordenes/usuario/me`);
    return data;
  }
);

const misOrdenesSlice = createSlice({
  name: "misOrdenes",
  initialState: {
    ordenes: [],
    loading: false,
    error: null,
    status: "idle",
    ordenSeleccionada: null,
  },
  reducers: {
    limpiarMisOrdenes: (state) => {
      state.ordenes = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerMisOrdenes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(obtenerMisOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.ordenes = action.payload;
      })
      .addCase(obtenerMisOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
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
  },
});

export const { limpiarMisOrdenes } = misOrdenesSlice.actions;
export default misOrdenesSlice.reducer;