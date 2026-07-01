import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

// Thunks
// El token se inyecta automáticamente por el interceptor de axios en store.js

export const fetchGeneros = createAsyncThunk('generos/fetchAll', async () => {
  const { data } = await axios.get(`${BASE_URL}/generos`)
  return data.map(g => ({
    id:     g.id ?? g.idGenero,
    nombre: g.nombre,
  }))
})

export const crearGenero = createAsyncThunk('generos/crear', async (payload) => {
  const { data } = await axios.post(`${BASE_URL}/generos`, payload)
  return {
    id:     data.id ?? data.idGenero,
    nombre: data.nombre,
  }
})

export const editarGenero = createAsyncThunk('generos/editar', async ({ id, cambios }) => {
  const { data } = await axios.patch(`${BASE_URL}/generos/${id}`, cambios)
  return {
    id:     data.id ?? data.idGenero,
    nombre: data.nombre,
  }
})

export const eliminarGenero = createAsyncThunk('generos/eliminar', async (id) => {
  await axios.delete(`${BASE_URL}/generos/${id}`)
  return id
})

// Slice

const generosSlice = createSlice({
  name: 'generos',
  initialState: {
    items:   [],
    loading: false,
    error:   null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneros.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
      })
      .addCase(fetchGeneros.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchGeneros.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(crearGenero.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      .addCase(editarGenero.fulfilled, (state, action) => {
        const index = state.items.findIndex(g => g.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })

      .addCase(eliminarGenero.fulfilled, (state, action) => {
        state.items = state.items.filter(g => g.id !== action.payload)
      })
  },
})

export default generosSlice.reducer