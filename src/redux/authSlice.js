import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

// Thunk 1: login — POST authenticate + GET /usuarios/me
export const loginUsuario = createAsyncThunk('auth/login', async (credenciales) => {
  const { data: authData } = await axios.post(`${BASE_URL}/api/v1/auth/authenticate`, credenciales)

  const { data: usuarioData } = await axios.get(`${BASE_URL}/usuarios/me`, {
    headers: { Authorization: `Bearer ${authData.access_token}` }
  })

  return {
    token: authData.access_token,
    usuario: {
      email:     usuarioData.email,
      nombre:    `${usuarioData.firstName || usuarioData.firstname || ''} ${usuarioData.lastName || usuarioData.lastname || ''}`.trim(),
      firstName: usuarioData.firstName || usuarioData.firstname || '',
      lastName:  usuarioData.lastName  || usuarioData.lastname  || '',
      rol:       usuarioData.role === 'ADMINISTRADOR' ? 'admin' : 'usuario',
    }
  }
})

// Thunk 2: actualizar perfil — PATCH /usuarios/me
export const actualizarPerfil = createAsyncThunk('auth/actualizarPerfil', async (datosActualizados, { getState }) => {
  const token = getState().auth.token
  const { data } = await axios.patch(`${BASE_URL}/usuarios/me`, datosActualizados, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
})

// Thunk 3: registro — POST register
export const registrarUsuario = createAsyncThunk('auth/registro', async (datosUsuario) => {
  const { data: authData } = await axios.post(`${BASE_URL}/api/v1/auth/register`, datosUsuario)

  return {
    token: authData.access_token,
    usuario: {
      email:     datosUsuario.email,
      nombre:    `${datosUsuario.firstname} ${datosUsuario.lastname}`.trim(),
      firstName: datosUsuario.firstname || '',
      lastName:  datosUsuario.lastname  || '',
      rol:       'usuario',
    }
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Acción síncrona que limpia el estado al cerrar sesión
    logout: (state) => {
      state.usuario = null
      state.token = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUsuario.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.usuario = action.payload.usuario
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // actualizar perfil
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

      // registro
      .addCase(registrarUsuario.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registrarUsuario.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.usuario = action.payload.usuario
      })
      .addCase(registrarUsuario.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer