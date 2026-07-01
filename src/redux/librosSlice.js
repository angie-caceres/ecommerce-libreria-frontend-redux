import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { logout } from './authSlice'

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
    const { data } = await axios.post(`${BASE_URL}/libros`, libroBody)
    return data
  }
)

export const asignarImagenLibro = createAsyncThunk(
  'libros/asignarImagen',
  async ({ idLibro, imagenId }) => {
    await axios.patch(`${BASE_URL}/libros/${idLibro}/imagen/${imagenId}`)
    return { idLibro, imagenId }
  }
)

export const fetchLibroByIdAdmin = createAsyncThunk(
  'libros/fetchByIdAdmin',
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/libros/${id}/admin`)
    return data
  }
)

export const editarLibro = createAsyncThunk(
  'libros/editar',
  async ({ id, form, libroOriginal, generos, editoriales }) => {
    await axios.patch(`${BASE_URL}/libros/${id}`, {
      titulo:      form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      paginas:     parseInt(form.paginas) || 0,
      precio:      parseFloat(form.precio) || 0,
      stock:       0,
      idGenero:    null,
      idEditorial: null,
      idDescuento: null,
      idAutores:   [],
    })

    const generoOriginalId = generos.find(g => g.nombre === libroOriginal.genero)?.id
    if (form.genero && Number(form.genero) !== generoOriginalId) {
      await axios.patch(`${BASE_URL}/libros/${id}/genero/${form.genero}`)
    }

    const editorialOriginalId = editoriales.find(e => e.nombre === libroOriginal.editorial)?.id
    if (form.editorial && Number(form.editorial) !== editorialOriginalId) {
      await axios.patch(`${BASE_URL}/libros/${id}/editorial/${form.editorial}`)
    }

    if (form.autores) {
      await axios.patch(`${BASE_URL}/libros/${id}/autores`, [parseInt(form.autores)])
    }

    const stockNum = parseInt(form.stock)
    if (stockNum > 0) {
      await axios.patch(`${BASE_URL}/libros/${id}/stock?cantidad=${stockNum}`)
    }

    if (form.imagenId && form.imagenId !== libroOriginal.imagen?.id?.toString()) {
      await axios.patch(`${BASE_URL}/libros/${id}/imagen/${form.imagenId}`)
    }

    if (form.descuento) {
      await axios.patch(`${BASE_URL}/libros/${id}/descuento/${form.descuento}`)
    }
  }
)

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
      // FETCH LIBROS — único que modifica status
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

      // FETCH LIBRO POR ID — no toca status
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

      // CREAR LIBRO — no toca status
      .addCase(crearLibro.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(crearLibro.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(crearLibro.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // ASIGNAR IMAGEN — no toca status
      .addCase(asignarImagenLibro.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(asignarImagenLibro.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(asignarImagenLibro.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // FETCH LIBRO ADMIN — no toca status
      .addCase(fetchLibroByIdAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.libroActual = null
      })
      .addCase(fetchLibroByIdAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.libroActual = action.payload
      })
      .addCase(fetchLibroByIdAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // EDITAR LIBRO — no toca status
      .addCase(editarLibro.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editarLibro.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(editarLibro.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // LOGOUT — resetea status para que el catálogo re-fetchee con data fresca
      .addCase(logout, (state) => {
        state.status = 'idle'
      })
  },
})

export default librosSlice.reducer