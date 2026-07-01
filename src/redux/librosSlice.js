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
// Asignar imagen a libro
export const asignarImagenLibro = createAsyncThunk(
  'libros/asignarImagen',
  async ({ idLibro, imagenId }) => {
    await axios.patch(
      `${BASE_URL}/libros/${idLibro}/imagen/${imagenId}`
    )

    return { idLibro, imagenId }
  }
)

// Cargar el libro a editar para admin 
export const fetchLibroByIdAdmin = createAsyncThunk(
  'libros/fetchByIdAdmin',
  async (id) => {
    const { data } = await axios.get(`${BASE_URL}/libros/${id}/admin`)
    return data
  }
)

// Thunk unico que agrupa todos los paatch de edicion
export const editarLibro = createAsyncThunk(
  'libros/editar',
  async ({ id, form, libroOriginal, generos, editoriales }) => {

    // Datos básicos
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

    // Género evalua si cambia
    const generoOriginalId = generos.find(g => g.nombre === libroOriginal.genero)?.id
    if (form.genero && Number(form.genero) !== generoOriginalId) {
      await axios.patch(`${BASE_URL}/libros/${id}/genero/${form.genero}`)
    }

    // Editorial evalua si cambia
    const editorialOriginalId = editoriales.find(e => e.nombre === libroOriginal.editorial)?.id
    if (form.editorial && Number(form.editorial) !== editorialOriginalId) {
      await axios.patch(`${BASE_URL}/libros/${id}/editorial/${form.editorial}`)
    }

    // Autores
    if (form.autores) {
      await axios.patch(`${BASE_URL}/libros/${id}/autores`, [parseInt(form.autores)])
    }

    // Stock
    const stockNum = parseInt(form.stock)
    if (stockNum > 0) {
      await axios.patch(`${BASE_URL}/libros/${id}/stock?cantidad=${stockNum}`)
    }

    // Imagen
    if (form.imagenId && form.imagenId !== libroOriginal.imagen?.id?.toString()) {
      await axios.patch(`${BASE_URL}/libros/${id}/imagen/${form.imagenId}`)
    }

    // Descuento
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

      // FETCH LIBRO ADMIN
      .addCase(fetchLibroByIdAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
        state.libroActual = null
      })
      .addCase(fetchLibroByIdAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.libroActual = action.payload
      })
      .addCase(fetchLibroByIdAdmin.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })

      // EDITAR LIBRO
      .addCase(editarLibro.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = 'loading'
      })
      .addCase(editarLibro.fulfilled, (state) => {
        state.loading = false
        state.status = 'succeeded'
      })
      .addCase(editarLibro.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default librosSlice.reducer