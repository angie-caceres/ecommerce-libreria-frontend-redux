import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import axios from 'axios'
import authReducer from './authSlice'
import usuariosReducer from './usuariosSlice'
import librosReducer from './librosSlice'
import autoresReducer from './autoresSlice'
import generosReducer from './generosSlice'
import editorialesReducer from './editorialesSlice'
import misOrdenesReducer from "./ordenSlice";
import carritoReducer from "./carritoSlice";
import descuentosReducer from "./descuentosSlice";
import imagenesReducer from "./imagenesSlice";


// Adaptador de storage por incompatibilidad de redux-persist con Vite
const storage = {
  getItem:    (key) => Promise.resolve(localStorage.getItem(key)),
  setItem:    (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

// Solo persiste el slice de auth (token y usuario) — libros se fetchean siempre frescos
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const rootReducer = combineReducers({
  auth:     authReducer,
  usuarios: usuariosReducer,
  libros:   librosReducer,
  autores: autoresReducer,
  generos: generosReducer,
  editoriales: editorialesReducer,
  orden: misOrdenesReducer,
  carrito: carritoReducer,
  descuentos: descuentosReducer,
  imagenes: imagenesReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist usa acciones internas no serializables — se ignoran
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/FLUSH', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
})

export const persistor = persistStore(store)

// Interceptor global que inyecta el token JWT en todos los requests de axios automáticamente
axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta — extrae el mensaje real del backend en los errores
// Equivalente a lo que hacía apiFetch: leer response.json() y sacar .message
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message
    return Promise.reject(new Error(mensaje))
  }
)