// VISTA — página principal que compone todos los componentes del home
// Las vistas combinan componentes para formar una pantalla completa
import Carrusel from '../components/Carrusel'
import Novedades from '../components/Novedades'
import Quote from '../components/Quote'

function Home() {
  return (
    // COMPOSICIÓN JERÁRQUICA — Home es el padre que renderiza sus hijos
    // React construye la interfaz combinando múltiples piezas pequeñas
    <div>

      {/* COMPONENTE hijo Carousel — muestra el carrusel de libros destacados */}
      <Carrusel />

      {/* COMPONENTE hijo Novedades — muestra la grilla de libros nuevos */}
      <Novedades />

      {/* COMPONENTE hijo Quote — muestra la frase literaria */}
      <Quote />

    </div>
  )
}

// EXPORTACIÓN de la vista
export default Home