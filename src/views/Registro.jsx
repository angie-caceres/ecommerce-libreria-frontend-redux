// VISTA Registro
import RegistroForm from "../components/RegistroForm"
import { useNavigate } from "react-router-dom"

// PROPS — recibe setUsuario del padre App.jsx
function Registro({ setUsuario }) {
  const navigate = useNavigate()

  // EVENTO — recibe los datos del hijo y actualiza el estado global
  // Flujo unidireccional — hijo comunica al padre
  const handleSubmit = (datosFormulario) => {
    setUsuario({ ...datosFormulario, rol: 'usuario' })
    navigate("/perfil")
  }

  return (
    <main className="bg-[#faf7f5] px-4 py-10">
      {/* COMPONENTE hijo — recibe onSubmit como prop */}
      <RegistroForm onSubmit={handleSubmit} />
    </main>
  )
}

export default Registro