import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

export const fetchLibros = createAsyncThunk(
  'libros/fetchAll',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/libros`)
    return data
  }
)

export const fetchLibroById = createAsyncThunk(
  'libros/fetchById',
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/libros/${id}`)
    return data
  }
)

export const crearLibro = createAsyncThunk(
  'libros/crear',
  async (libroBody) => {
    const { data } = await axios.post(
      `${BASE_URL}/libros`,
      libroBody
    )
    return data
  }
)

export const asignarImagenLibro = createAsyncThunk(
  'libros/asignarImagen',
  async ({ idLibro, imagenId }) => {
    await axios.patch(
      `${BASE_URL}/libros/${idLibro}/imagen/${imagenId}`
    )

    return { idLibro, imagenId }
  }
)

const librosSlice = createSlice({
  name: 'libros',

  initialState: {
    items: [],
    libroActual: null,
    loading: false,
    error: null,
    status: 'idle', // idle | loading | succeeded | failed
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH LIBROS
      .addCase(fetchLibros.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
      })
      .addCase(fetchLibros.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchLibros.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })

      // FETCH LIBRO POR ID
      .addCase(fetchLibroById.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
        state.libroActual = null
      })
      .addCase(fetchLibroById.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.libroActual = action.payload
      })
      .addCase(fetchLibroById.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })

      // CREAR LIBRO
      .addCase(crearLibro.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
      })
      .addCase(crearLibro.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(crearLibro.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })

      // ASIGNAR IMAGEN
      .addCase(asignarImagenLibro.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
      })
      .addCase(asignarImagenLibro.fulfilled, (state) => {
        state.loading = false
        state.status = 'succeeded'
      })
      .addCase(asignarImagenLibro.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default librosSlice.reducer