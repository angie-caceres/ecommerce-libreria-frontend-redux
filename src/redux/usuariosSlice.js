import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

export const fetchUsuarios = createAsyncThunk('usuarios/fetchAll', async () => {
  const { data } = await axios.get(`${BASE_URL}/usuarios`)
  return data
})

// No GET después de la mutación — actualiza el estado directo con la respuesta del PATCH
export const toggleEstadoUsuario = createAsyncThunk('usuarios/toggleEstado', async (idUsuario) => {
  const { data } = await axios.patch(`${BASE_URL}/usuarios/${idUsuario}/activo`)
  return data
})

export const actualizarPerfil = createAsyncThunk('usuarios/actualizarPerfil', async (datosActualizados) => {
  const { data } = await axios.patch(`${BASE_URL}/usuarios/me`, datosActualizados)
  return data
})

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: {
    items: [],
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })

      .addCase(toggleEstadoUsuario.fulfilled, (state, action) => {
        const actualizado = action.payload
        state.items = state.items.map(u =>
          u.idUsuario === actualizado.idUsuario ? actualizado : u
        )
      })

      .addCase(actualizarPerfil.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(actualizarPerfil.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(actualizarPerfil.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default usuariosSlice.reducer