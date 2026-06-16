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
  const handleSubmit = async (nuevoUsuario) => {
  try {
    const response = await fetch("http://localhost:4002/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoUsuario)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token)

      const usuarioLogueado = {
        email: nuevoUsuario.email,
        nombre: `${nuevoUsuario.firstname} ${nuevoUsuario.lastname}`.trim(),
        rol: nuevoUsuario.role === "ADMINISTRADOR" ? "admin" : "usuario",
        token: data.token
      }

      localStorage.setItem("usuario", JSON.stringify(usuarioLogueado))
      setUsuario(usuarioLogueado)

      setRegistrado(true)
      setTimeout(() => navigate("/"), 2000)
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
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