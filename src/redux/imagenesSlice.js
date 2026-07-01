import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002";

export const fetchImagenes = createAsyncThunk(
  "imagenes/fetchAll",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/imagenes/todas`);
    return data;
  }
);

export const eliminarImagen = createAsyncThunk(
  "imagenes/eliminar",
  async (id) => {
    await axios.delete(`${BASE_URL}/imagenes/${id}`);
    return id;
  }
);

const imagenesSlice = createSlice({
  name: "imagenes",
  initialState: {
    items: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagenes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchImagenes.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchImagenes.rejected, (state) => {
        state.loading = false;
        state.status = "failed";
        state.error = "No se pudieron cargar las imágenes.";
      })

      .addCase(eliminarImagen.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(eliminarImagen.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = state.items.filter(
          (imagen) => imagen.id !== action.payload
        );
      })
      .addCase(eliminarImagen.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error =
          action.error.message || "No se pudo eliminar la imagen.";
      })
  },
});

export default imagenesSlice.reducer;