import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:4002'

export const fetchEditoriales = createAsyncThunk('editoriales/fetchAll', async () => {
  const { data } = await axios.get(`${BASE_URL}/editoriales`)
  return data
})

export const createEditorial = createAsyncThunk('editoriales/create', async (nombre) => {
  const { data } = await axios.post(`${BASE_URL}/editoriales`, { nombre })
  return data
})

export const updateEditorial = createAsyncThunk('editoriales/update', async ({ id, nombre }) => {
  const { data } = await axios.patch(`${BASE_URL}/editoriales/${id}`, { nombre })
  return data
})

export const deleteEditorial = createAsyncThunk('editoriales/delete', async (id) => {
  await axios.delete(`${BASE_URL}/editoriales/${id}`)
  return id
})

const normalizar = (e) => ({ id: e.id || e.idEditorial, nombre: e.nombre })

const editorialesSlice = createSlice({
  name: 'editoriales',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchEditoriales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEditoriales.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.map(normalizar)
      })
      .addCase(fetchEditoriales.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // create
      .addCase(createEditorial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEditorial.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(normalizar(action.payload))
      })
      .addCase(createEditorial.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // update
      .addCase(updateEditorial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEditorial.fulfilled, (state, action) => {
        state.loading = false
        const e = normalizar(action.payload)
        const idx = state.items.findIndex(item => item.id === e.id)
        if (idx !== -1) state.items[idx] = e
      })
      .addCase(updateEditorial.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // delete
      .addCase(deleteEditorial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEditorial.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(deleteEditorial.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default editorialesSlice.reducer