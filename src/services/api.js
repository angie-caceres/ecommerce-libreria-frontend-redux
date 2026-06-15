const BASE_URL = 'http://localhost:4002'

export const apiFetch = async (endpoint, token = null, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const mensaje = errorData?.message || `Error ${response.status}`
    throw new Error(mensaje)
  }

  if (response.status === 204) return null
  return response.json()
}