// FUNCIÓN utilitaria — calcula el precio final aplicando el descuento
// Se exporta para usar en cualquier componente que lo necesite
// Centraliza la lógica en un solo lugar para evitar duplicación
export function calcularPrecioFinal(precioOriginal, descuento) {
  if (!descuento) return precioOriginal
  const porcentaje = parseInt(descuento.replace('-', '').replace('%', ''))
  return precioOriginal - (precioOriginal * porcentaje / 100)
}