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

export const fetchLibrosAdmin = createAsyncThunk(
  'libros/fetchAllAdmin',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/libros/todos`)
    return data.map(libro => ({
      id:             libro.idLibro,
      titulo:         libro.titulo,
      autor:          libro.autores?.join(', ') || 'Sin autor',
      genero:         libro.genero,
      precioOriginal: libro.precio,
      descuento:      libro.porcentajeDescuento ? `${libro.porcentajeDescuento}%` : '0%',
      stock:          libro.stock,
      activo:         !!libro.activo,
    }))
  }
)

export const toggleActivoLibro = createAsyncThunk(
  'libros/toggleActivo',
  async ({ id, activo }) => {
    if (activo) {
      await axios.delete(`${BASE_URL}/libros/${id}`)
    } else {
      await axios.patch(`${BASE_URL}/libros/${id}/activar`)
    }
    return { id, activo }
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
    itemsAdmin: [],
    libroActual: null,
    loading: false,
    error: null,
    status: 'idle',
    statusAdmin: 'idle',
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

      // FETCH LIBROS ADMIN — modifica statusAdmin (no status)
      .addCase(fetchLibrosAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.statusAdmin = 'loading'
      })
      .addCase(fetchLibrosAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.statusAdmin = 'succeeded'
        state.itemsAdmin = action.payload
      })
      .addCase(fetchLibrosAdmin.rejected, (state, action) => {
        state.loading = false
        state.statusAdmin = 'failed'
        state.error = action.error.message
      })

      // TOGGLE ACTIVO — actualiza el item en itemsAdmin directamente
      .addCase(toggleActivoLibro.fulfilled, (state, action) => {
        const libro = state.itemsAdmin.find(l => l.id === action.payload.id)
        if (libro) libro.activo = !action.payload.activo
      })
      .addCase(toggleActivoLibro.rejected, (state, action) => {
        state.error = action.error.message
      })

      // LOGOUT — resetea status y statusAdmin para re-fetchear con data fresca
      .addCase(logout, (state) => {
        state.status = 'idle'
        state.statusAdmin = 'idle'
      })
  },
})

export default librosSlice.reducer