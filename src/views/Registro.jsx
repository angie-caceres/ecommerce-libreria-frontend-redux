// VISTA Registro
import { useState } from 'react'
import RegistroForm from "../components/RegistroForm"
import { useNavigate } from "react-router-dom"
import Alerta from '../components/Alerta'

// PROPS — recibe setUsuario del padre App.jsx
function Registro({ setUsuario }) {
  const navigate = useNavigate()

  // HOOK useState — controla si se muestra la alerta
  const [registrado, setRegistrado] = useState(false)

  // EVENTO — recibe los datos del hijo y actualiza el estado global
  const handleSubmit = (datosFormulario) => {
    setUsuario({ ...datosFormulario, rol: "usuario", ordenes: [] });

    setRegistrado(true);

    setTimeout(() => {
      navigate("/");
    }, 2000); // 2 segundos
  };

  return (
    <main className="bg-[#faf7f5] px-4 py-10">

      {/* RENDERIZADO CONDICIONAL con &&
          Muestra alerta si el registro fue exitoso
  */}
      {registrado && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alerta
            texto="¡Te registraste con éxito!"
            onClose={() => setRegistrado(false)}
          />
        </div>
      )}

      <RegistroForm onSubmit={handleSubmit} />
    </main>
  )
}

export default Registro