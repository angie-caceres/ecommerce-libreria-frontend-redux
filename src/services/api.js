// URL base del backend
const BASE_URL = 'http://localhost:4002'

// Función base para hacer fetch
// token es opcional — los endpoints públicos no lo necesitan
export const apiFetch = async (endpoint, token = null, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) throw new Error(`Error ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}