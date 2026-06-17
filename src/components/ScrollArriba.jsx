// Resetea el scroll al inicio en cada cambio de ruta
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollArriba() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollArriba