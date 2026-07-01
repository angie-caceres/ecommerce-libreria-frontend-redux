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
    .addCase(fetchDescuentos.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    })
    .addCase(fetchDescuentos.fulfilled, (state, action) => {
      state.loading = false;
      state.status = "succeeded";
      state.lista = action.payload.lista;
      state.totalPaginas = action.payload.totalPaginas;
      state.totalItems = action.payload.totalItems;
    })
    .addCase(fetchDescuentos.rejected, (state) => {
      state.loading = false;
      state.error = "No se pudieron cargar los descuentos.";
      state.status = "failed";
    })

    .addCase(crearDescuento.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    })
    .addCase(crearDescuento.fulfilled, (state) => {
      state.loading = false
      state.status = "succeeded"
    })
    .addCase(crearDescuento.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error.message
      state.status = "failed"
    })

    .addCase(toggleDescuento.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(toggleDescuento.fulfilled, (state, action) => {
      state.loading = false

      const actualizado = action.payload

      state.lista = state.lista.map((descuento) =>
        descuento.id === actualizado.id ? actualizado : descuento
      )
    })
    .addCase(toggleDescuento.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
});

export const { limpiarErrorDescuentos } = descuentosSlice.actions;
export default descuentosSlice.reducer;