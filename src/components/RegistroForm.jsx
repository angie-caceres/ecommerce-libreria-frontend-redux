// COMPONENTE reutilizable — formulario de registro
import { useState } from "react"
import { Link } from "react-router-dom"

// PROPS — recibe onSubmit del padre Registro.jsx
function RegistroForm({ onSubmit }) {

  // HOOK useState — estado local del formulario
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail]                       = useState("")
  const [password, setPassword]                 = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")

  // HOOK useState — error de validación
  // Reemplaza alert() — no toca el DOM directamente
  const [error, setError] = useState("")

  // EVENTO — procesa el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmarPassword) {
      // Validación con estado — no usa alert()
      setError("Las contraseñas no coinciden")
      return
    }

    setError("")
    const nuevoUsuario = {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      role: "USER"
    }
  }

  return (
    <section className="mx-auto max-w-6xl border border-[#ead8d4] bg-white px-8 py-12 md:px-20">

      <div className="mb-14 text-center">
        <h1 className="font-serif text-4xl text-[#351118]">Crear Cuenta</h1>
        <p className="mt-3 text-gray-500">Únase a nuestra selecta comunidad de bibliófilos.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-7">
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#5c4b51]">
            Nombre
          </label>
          <input
            type="text"
            placeholder="p. ej. Miguel"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-7">
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#5c4b51]">
            Apellido
          </label>
          <input
            type="text"
            placeholder="p. ej. Cervantes"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-7">
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#5c4b51]">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@libro.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#5c4b51]">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#5c4b51]">
              Confirmar
            </label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              className="w-full border-b border-[#8c7a80] bg-transparent px-3 py-3 outline-none"
            />
          </div>
        </div>

        {/* RENDERIZADO CONDICIONAL con &&
            Muestra error sin tocar el DOM
  */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#4b385c] py-4 text-sm font-semibold tracking-[0.25em] text-white transition hover:bg-[#382943]"
        >
          REGISTRARSE
        </button>

      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-semibold text-[#4b385c] underline">
          Iniciar sesión
        </Link>
      </p>

      <div className="my-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-[#eadfdd]"></div>
        <span className="text-[#c9a6a6]">◇</span>
        <div className="h-px flex-1 bg-[#eadfdd]"></div>
      </div>

      <div className="text-center">
        <p className="font-serif text-xl text-[#351118]">
          "La lectura es una conversación con los hombres más ilustres de los siglos pasados"
        </p>
        <p className="mt-4 text-xs font-semibold tracking-widest text-gray-500">— DESCARTES</p>
      </div>

    </section>
  )
}

export default RegistroForm