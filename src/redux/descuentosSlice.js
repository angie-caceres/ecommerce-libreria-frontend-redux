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
  async (porcentaje, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(BASE_URL, {
        porcentaje,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo crear el descuento."
      );
    }
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
    status: "idle",
  },
  reducers: {
    limpiarErrorDescuentos: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(crearDescuento.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(crearDescuento.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(crearDescuento.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo crear el descuento.";
        state.status = "failed";
      })

      .addCase(toggleDescuento.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(toggleDescuento.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(toggleDescuento.rejected, (state) => {
        state.loading = false;
        state.error = "Error al cambiar estado del descuento.";
        state.status = "failed";
      });
  },
});

export const { limpiarErrorDescuentos } = descuentosSlice.actions;
export default descuentosSlice.reducer;