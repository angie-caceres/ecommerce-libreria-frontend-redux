// VISTA — página de Contacto
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { BsTelephone, BsEnvelope, BsClock } from 'react-icons/bs'

function Contacto() {
  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-16">

      {/* Título fuera del cuadro */}
      <h1
        className="text-4xl text-center text-[#4E3B67] mb-12"
        style={{ fontFamily: "'Libre Caslon Text', serif" }}
      >
        Contacto
      </h1>

      <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-12 text-center">

        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          ¿Tenés alguna consulta?<br />
          Estamos para ayudarte y responder todas tus dudas sobre compras, envíos y productos.
        </p>

        {/* Datos de contacto */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <BsTelephone className="text-[#7B5B98]" />
            + 54 1123456789
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <BsEnvelope className="text-[#7B5B98]" />
            entreletras@gmail.com
          </p>
        </div>

        {/* Horarios */}
        <h2 className="text-sm font-bold text-gray-700 mb-4">
          Horarios de atención:
        </h2>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <BsClock className="text-[#7B5B98]" />
            Lunes a Viernes: 9:00 a 18:00
          </p>
          <p className="text-sm text-gray-500">
            Sábados: 10:00 a 14:00
          </p>
        </div>

      </div>

    </div>
  )
}

export default Contacto