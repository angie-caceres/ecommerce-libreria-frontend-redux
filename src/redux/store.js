import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import authReducer from './authSlice'
import librosReducer from './librosSlice'

// Adaptador de storage — workaround por incompatibilidad de redux-persist con Vite
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
  auth: authReducer,
  libros: librosReducer,
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