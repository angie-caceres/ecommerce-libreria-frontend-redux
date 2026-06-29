// VISTA Login
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUsuario } from '../redux/authSlice'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // useSelector — lee loading y error del store
  const { loading: cargando, error } = useSelector((state) => state.auth)

  // useState — campos del formulario (estado local de UI)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUsuario({ email, password }))

    // Navega según el rol si el login fue exitoso
    if (loginUsuario.fulfilled.match(result)) {
      const rol = result.payload.usuario.rol
      navigate(rol === 'admin' ? '/admin' : '/')
    }
  }

  return (
    <main className="bg-[#faf7f5] py-10 px-4">
      <section className="max-w-5xl mx-auto bg-white border border-[#eee5e1] shadow-sm px-10 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-[#351118] mb-3">
            Bienvenido
          </h1>
          <p className="text-gray-500">
            Accede a tu santuario literario personal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="mb-8">
            <label className="block font-serif text-2xl text-[#351118] mb-4">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@libros.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="mb-8">
            <label className="font-serif text-2xl text-[#351118]">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">Correo o contraseña incorrectos.</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#4b385c] text-white py-4 text-sm tracking-widest font-semibold hover:bg-[#382943] transition disabled:opacity-50"
          >
            {cargando ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="max-w-4xl mx-auto my-10 flex items-center gap-5">
          <div className="h-px bg-[#eadfdd] flex-1"></div>
          <span className="text-[#c9a6a6]">◇</span>
          <div className="h-px bg-[#eadfdd] flex-1"></div>
        </div>

        <p className="text-center text-gray-500 mb-8">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" className="text-[#7c5fa0] font-semibold">
            Regístrese
          </Link>
        </p>

        <div className="max-w-4xl mx-auto bg-[#f5f1f0] border-l-2 border-[#351118] py-7 px-6 text-center">
          <p className="font-serif italic text-xl text-[#351118]">
            "Un hogar sin libros es como un cuerpo sin alma."
          </p>
          <p className="text-xs text-gray-400 mt-3">— CICERÓN</p>
        </div>
      </section>
    </main>
  )
}

export default Login