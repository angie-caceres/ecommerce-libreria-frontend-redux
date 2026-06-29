// VISTA Registro
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RegistroForm from '../components/RegistroForm'
import Alerta from '../components/Alerta'
import { registrarUsuario } from '../redux/authSlice'

function Registro() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // useSelector — lee loading y error del store
  const { loading, error } = useSelector((state) => state.auth)

  // useState — controla si se muestra la alerta de éxito (estado local de UI)
  const [registrado, setRegistrado] = useState(false)

  const handleSubmit = async (nuevoUsuario) => {
    const result = await dispatch(registrarUsuario(nuevoUsuario))

    if (registrarUsuario.fulfilled.match(result)) {
      setRegistrado(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }

  return (
    <main className="bg-[#faf7f5] px-4 py-10">

      {registrado && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alerta
            texto="¡Te registraste con éxito!"
            onClose={() => setRegistrado(false)}
          />
        </div>
      )}

      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <p className="text-red-500 text-sm">Ocurrió un error al registrarse. Intentá de nuevo.</p>
        </div>
      )}

      <RegistroForm onSubmit={handleSubmit} loading={loading} />
    </main>
  )
}

export default Registro