import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

export const fetchLibros = createAsyncThunk('libros/fetchAll', async () => {
  const { data } = await axios.get(`${BASE_URL}/libros`)
  return data
})

export const fetchLibroById = createAsyncThunk('libros/fetchById', async (id) => {
  const { data } = await axios.get(`${BASE_URL}/libros/${id}`)
  return data
})

const librosSlice = createSlice({
  name: 'libros',
  initialState: {
    items: [],
    libroActual: null,
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibros.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchLibros.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchLibros.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchLibroById.pending, (state) => {
        state.loading = true
        state.error = null
        state.libroActual = null
      })
      .addCase(fetchLibroById.fulfilled, (state, action) => {
        state.loading = false
        state.libroActual = action.payload
      })
      .addCase(fetchLibroById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default librosSlice.reducer