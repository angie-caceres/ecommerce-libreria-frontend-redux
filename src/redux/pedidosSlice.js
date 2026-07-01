import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const BASE_URL = "http://localhost:4002"


export const fetchPedidos = createAsyncThunk(
  "pedidos/fetchAll",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/ordenes`)

    return data.map((pedido) => ({
      idOrden: pedido.idOrden,
      nombreUsuario: pedido.nombreUsuario,
      emailUsuario: pedido.emailUsuario,
      productos: pedido.productos,
      total: pedido.total,
      estado: pedido.estado,
    }))
  }
)

export const cancelarPedido = createAsyncThunk(
  "pedidos/cancelar",
  async (idOrden) => {
    await axios.patch(`${BASE_URL}/ordenes/${idOrden}/cancelar`)

    return idOrden
  }
)

//slice

const pedidosSlice = createSlice({
  name: "pedidos",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Obtener pedidos

      .addCase(fetchPedidos.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })

      .addCase(fetchPedidos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Cancelar pedido

      .addCase(cancelarPedido.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(cancelarPedido.fulfilled, (state, action) => {
        state.loading = false

        const pedido = state.items.find(
          (p) => p.idOrden === action.payload
        )

        if (pedido) {
          pedido.estado = "CANCELADA"
        }
      })

      .addCase(cancelarPedido.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default pedidosSlice.reducer