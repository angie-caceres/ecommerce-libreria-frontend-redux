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

export const agregarImagen = createAsyncThunk(
  "imagenes/agregar",
  async ({ nombre, archivo }) => {
    const formData = new FormData()
    formData.append("name", nombre)
    formData.append("file", archivo)
    await axios.post(`${BASE_URL}/imagenes`, formData)
  }
)

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
      // FETCH IMAGENES — único que modifica status
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

      // AGREGAR IMAGEN — resetea status para que el useEffect re-fetchee con la nueva imagen
      .addCase(agregarImagen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarImagen.fulfilled, (state) => {
        state.loading = false;
        state.status = "idle";
      })
      .addCase(agregarImagen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ELIMINAR IMAGEN — no toca status
      .addCase(eliminarImagen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarImagen.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((img) => img.id !== action.payload);
      })
      .addCase(eliminarImagen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "No se pudo eliminar la imagen.";
      })
  },
});

export default imagenesSlice.reducer;