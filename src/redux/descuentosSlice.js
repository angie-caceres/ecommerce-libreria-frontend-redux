import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/descuentos";
const POR_PAGINA = 9;

export const fetchDescuentos = createAsyncThunk(
  "descuentos/fetchAll",
  async (pagina = 1) => {
    const { data } = await axios.get(
      `${BASE_URL}?page=${pagina - 1}&size=${POR_PAGINA}`
    );

    return {
      lista: data.content,
      totalPaginas: data.totalPages,
      totalItems: data.totalElements,
    };
  }
);

export const crearDescuento = createAsyncThunk(
  "descuentos/crear",
  async (porcentaje) => {
    const { data } = await axios.post(BASE_URL, { porcentaje });
    return data;
  }
);

export const toggleDescuento = createAsyncThunk(
  "descuentos/toggle",
  async (id) => {
    const { data } = await axios.patch(`${BASE_URL}/${id}/toggle`);
    return data;
  }
);

const descuentosSlice = createSlice({
  name: "descuentos",
  initialState: {
    lista: [],
    totalPaginas: 1,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    limpiarErrorDescuentos: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescuentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentos.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload.lista;
        state.totalPaginas = action.payload.totalPaginas;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchDescuentos.rejected, (state) => {
        state.loading = false;
        state.error = "Error al cargar descuentos.";
      })

      .addCase(crearDescuento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearDescuento.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(crearDescuento.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo crear el descuento.";
      })

      .addCase(toggleDescuento.rejected, (state) => {
        state.error = "Error al cambiar estado del descuento.";
      });
  },
});

export const { limpiarErrorDescuentos } = descuentosSlice.actions;
export default descuentosSlice.reducer;