import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

// Thunks 
// El token se inyecta automáticamente por el interceptor de axios en store.js

export const fetchAutores = createAsyncThunk('autores/fetchAll', async () => {
  const { data } = await axios.get(`${BASE_URL}/autores`)
  return data.map(a => ({
    id:           a.id ?? a.idAutor,
    nombre:       a.nombre,
    apellido:     a.apellido || '',
    nacionalidad: a.nacionalidad || '',
  }))
})

export const crearAutor = createAsyncThunk('autores/crear', async (payload) => {
  const { data } = await axios.post(`${BASE_URL}/autores`, payload)
  return {
    id:           data.id ?? data.idAutor,
    nombre:       data.nombre,
    apellido:     data.apellido || '',
    nacionalidad: data.nacionalidad || '',
  }
})

export const editarAutor = createAsyncThunk('autores/editar', async ({ id, cambios }) => {
  const { data } = await axios.patch(`${BASE_URL}/autores/${id}`, cambios)
  return {
    id:           data.id ?? data.idAutor,
    nombre:       data.nombre,
    apellido:     data.apellido || '',
    nacionalidad: data.nacionalidad || '',
  }
})

export const eliminarAutor = createAsyncThunk('autores/eliminar', async (id) => {
  await axios.delete(`${BASE_URL}/autores/${id}`)
  return id
})

// Slice

const autoresSlice = createSlice({
  name: 'autores',
  initialState: {
    items:   [],
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutores.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAutores.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAutores.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(crearAutor.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      .addCase(editarAutor.fulfilled, (state, action) => {
        const index = state.items.findIndex(a => a.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })

      .addCase(eliminarAutor.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a.id !== action.payload)
      })
  },
})

export default autoresSlice.reducer