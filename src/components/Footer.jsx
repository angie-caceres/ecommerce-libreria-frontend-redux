// COMPONENTE — función JavaScript que devuelve JSX
// Nombre en PascalCase, archivo propio
import { BsTelephone, BsEnvelope, BsInstagram, BsTiktok } from 'react-icons/bs'
import { Link } from 'react-router-dom'

function Footer() {

  return (
    <footer className="bg-[#2d2640] text-white">

      {/* Contenido principal del footer */}
      <div className="grid grid-cols-4 gap-8 px-12 py-16">

        {/* Columna 1 — info de la librería */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Entre letras</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Entre letras es una librería online Argentina para que puedas conseguir tus libros favoritos.
          </p>
        </div>

        {/* Columna 2 — ayuda
            RENDERIZADO DE LISTA con .map()  */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Ayuda</h4>
          {['Sobre Nosotros', 'Preguntas frecuentes', 'Devoluciones'].map((item) => (
            // COMPONENTE Link — navega sin recargar
            <Link
              key={item}
              to="#"
              className="block text-sm text-gray-300 hover:text-white mb-2"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Columna 3 — contacto */}
        <div>
        <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Contáctanos</h4>
        <p className="text-sm text-gray-300 mb-2 flex items-center gap-2">
            <BsTelephone /> + 54 1123456789
        </p>
        <p className="text-sm text-gray-300 flex items-center gap-2">
            <BsEnvelope /> entreletras@gmail.com
        </p>
        </div>

        {/* Columna 4 — redes sociales */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Seguinos</h4>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Seguinos en nuestras redes para estar al tanto de novedades, recomendaciones y nuevas adquisiciones.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-xl">
              <BsInstagram />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-xl">
              <BsTiktok />
            </a>
          </div>
        </div>

      </div>

      {/* Barra inferior del footer */}
      <div className="border-t border-gray-700 px-12 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          © 2026 Entre letras todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-gray-500 text-sm">
          <button className="hover:text-white">↗</button>
          <button className="hover:text-white">↺</button>
          <button className="hover:text-white">🌐</button>
        </div>
      </div>

    </footer>
  )
}

// EXPORTACIÓN del componente
export default Footer