import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import axios from 'axios'
import authReducer from './authSlice'
import librosReducer from './librosSlice'
import autoresReducer from './autoresSlice'
import generosReducer from './generosSlice'
import editorialesReducer from './editorialesSlice'
import misOrdenesReducer from "./misOrdenesSlice";
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
  auth:    authReducer,
  libros:  librosReducer,
  autores: autoresReducer,
  generos: generosReducer,
  editoriales: editorialesReducer,
  misOrdenes: misOrdenesReducer,
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