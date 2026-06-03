// VISTA Perfil
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// PROPS — recibe usuario y cerrarSesion del padre App.jsx
// (PDF: Estados locales y props - ¿Qué son las props?)
function Perfil({ usuario, cerrarSesion }) {

  const navigate = useNavigate()

  // HOOK useState — controla si está en modo edición
  // (PDF: Estados locales y props - useState)
  const [editando, setEditando] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  const handleGuardar = () => {
    setEditando(false)
    setConfirmado(true)
    // Con backend: fetch PUT /api/usuarios con los datos
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  const handleVolver = () => {
    // RENDERIZADO CONDICIONAL — vuelve según el rol
    // (PDF: Renderizado condicional - Operador ternario)
    navigate(usuario?.rol === 'admin' ? '/admin/generos' : '/')
  }

  return (
    <main className="bg-[#faf7f5] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#eee5e1] shadow-sm px-10 py-12">

        <h1 className="text-4xl font-serif text-[#351118] mb-2">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mb-8">Tus datos personales</p>

        {/* RENDERIZADO CONDICIONAL con &&
            Muestra mensaje de confirmación si guardó cambios
            (PDF: Renderizado condicional - Operador &&) */}
        {confirmado && (
          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded mb-6 text-sm">
            ✓ Cambios guardados. Vas a tener que volver a iniciar sesión.
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email</label>
            <p className="text-gray-700">{usuario?.email}</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Rol</label>
            <p className="text-gray-700 capitalize">{usuario?.rol}</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 mt-10">

          {/* RENDERIZADO CONDICIONAL con ternario
              Muestra botón guardar o editar según el estado
              (PDF: Renderizado condicional - Operador ternario) */}
          {editando ? (
            <button
              onClick={handleGuardar}
              className="w-full bg-[#4b385c] text-white py-3 text-sm tracking-widest hover:bg-[#382943] transition"
            >
              GUARDAR CAMBIOS
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="w-full bg-[#4b385c] text-white py-3 text-sm tracking-widest hover:bg-[#382943] transition"
            >
              EDITAR PERFIL
            </button>
          )}

          <button
            onClick={handleVolver}
            className="w-full border border-gray-300 text-gray-500 py-3 text-sm tracking-widest hover:bg-gray-50 transition"
          >
            VOLVER
          </button>

          <button
            onClick={handleCerrarSesion}
            className="w-full border border-red-200 text-red-400 py-3 text-sm tracking-widest hover:bg-red-50 transition"
          >
            SALIR
          </button>

        </div>
      </div>
    </main>
  )
}

export default Perfil