// COMPONENTE — función JavaScript que devuelve JSX
// Nombre en PascalCase, archivo propio
import { useState } from 'react'
import { BsTelephone, BsEnvelope } from 'react-icons/bs'
import { Link } from 'react-router-dom'

function Footer() {

  // HOOK useState — guarda el email del newsletter en el estado local
  const [email, setEmail] = useState('')

  // EVENTO — actualiza el estado cada vez que el usuario escribe
  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  // EVENTO — maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    // acá iría la lógica de suscripción
    setEmail('')
  }

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

        {/* Columna 4 — newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Suscripción al newsletter</h4>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Suscribite a nuestro newsletter para enterarte de todas las novedades y tener acceso prioritario a nuevas adquisiciones.
          </p>

          {/* Formulario — EVENTO onSubmit */}
          <form onSubmit={handleSubmit} className="flex items-center border-b border-gray-500 pb-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              // EVENTO onChange — actualiza el estado con cada tecla
              onChange={handleChange}
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none flex-1"
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-white ml-2"
            >
              →
            </button>
          </form>
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