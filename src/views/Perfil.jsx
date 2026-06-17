// VISTA Perfil
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import Swal from 'sweetalert2'

// PROPS — recibe usuario y cerrarSesion del padre App.jsx
function Perfil({ usuario, cerrarSesion }) {

  const navigate = useNavigate()

  // HOOK useState — estado local del formulario
  const [form, setForm] = useState({
    firstName: usuario?.firstName || usuario?.nombre || '',
    lastName: usuario?.lastName || usuario?.apellido || '',
    email: usuario?.email || '',
    password: '',
  })

  // HOOK useState — controla qué campo está siendo editado
  const [editando, setEditando] = useState({
  firstName: false,
    lastName: false,
    email: false,
    password: false,
  })

  // EVENTO — actualiza el campo editado
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // EVENTO — activa la edición de un campo
  const handleEditar = (campo) => {
    setEditando(prev => ({ ...prev, [campo]: true }))
  }

  // EVENTO — guarda los cambios y pide que vuelva a loguearse
  const handleGuardar = () => {
  Swal.fire({
    title: '¿Guardar cambios?',
    text: 'Para aplicar los cambios vas a tener que volver a iniciar sesión.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4b385c',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem("jwtToken") || localStorage.getItem("token")

      const datosActualizados = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      }

      if (form.password.trim() !== '') {
        datosActualizados.password = form.password
      }

      const response = await fetch("http://localhost:4002/usuarios/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizados)
      })
      if (!response.ok) {
        Swal.fire("Error", "No se pudieron guardar los cambios", "error")
        return
      }

      Swal.fire("Guardado", "Tus datos fueron actualizados", "success")
      cerrarSesion()
      navigate('/login')
    }
  })
}

  const handleVolver = () => {
    // RENDERIZADO CONDICIONAL — vuelve según el rol
    navigate(usuario?.rol === 'admin' ? '/admin/generos' : '/')
  }

  // Cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  // Verifica si hay algún campo siendo editado
  const hayEdicion = Object.values(editando).some(v => v === true)

  return (
    <main className="bg-[#faf7f5] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#eee5e1] shadow-sm px-10 py-12">

        <h1 className="text-4xl font-serif text-[#351118] mb-2">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mb-10">Tus datos personales</p>

        <div className="space-y-8">

          {/* Campo Nombre */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Nombre
            </label>
            <div className="flex items-center gap-3 border-b border-[#cbbfc2] pb-3">
              {editando.firstName ? (
                <input
                  autoFocus
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              ) : (
                <p className="flex-1 text-gray-700 text-sm">
                  {form.firstName || "—"}
                </p>
              )}

              {!editando.firstName && (
                <button
                  onClick={() => handleEditar('firstName')}
                  className="text-gray-400 hover:text-purple-600 transition"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>
          {/* Campo Apellido */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Apellido
            </label>
            <div className="flex items-center gap-3 border-b border-[#cbbfc2] pb-3">
              {editando.lastName ? (
                <input
                  autoFocus
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              ) : (
                <p className="flex-1 text-gray-700 text-sm">
                  {form.lastName || "—"}
                </p>
              )}

              {!editando.lastName && (
                <button
                  onClick={() => handleEditar('lastName')}
                  className="text-gray-400 hover:text-purple-600 transition"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 border-b border-[#cbbfc2] pb-3">
              {editando.email ? (
                <input
                  autoFocus
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              ) : (
                <p className="flex-1 text-gray-700 text-sm">{form.email}</p>
              )}
              {!editando.email && (
                <button onClick={() => handleEditar('email')} className="text-gray-400 hover:text-purple-600 transition">
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Contraseña
            </label>
            <div className="flex items-center gap-3 border-b border-[#cbbfc2] pb-3">
              {editando.password ? (
                <input
                  autoFocus
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nueva contraseña"
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              ) : (
                <p className="flex-1 text-gray-700 text-sm">
                  {"•".repeat(form.password.length)}
                </p>
              )}
              {!editando.password && (
                <button onClick={() => handleEditar('password')} className="text-gray-400 hover:text-purple-600 transition">
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 mt-10">

          {/* RENDERIZADO CONDICIONAL con &&
              Solo muestra el botón guardar si hay algún campo editado
  */}
          {hayEdicion && (
            <button
              onClick={handleGuardar}
              className="w-full bg-[#4b385c] text-white py-3 text-sm tracking-widest hover:bg-[#382943] transition"
            >
              GUARDAR CAMBIOS
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
            className="w-full bg-[#382943] text-white py-3 text-sm tracking-widest hover:bg-[#2b1f35] transition">
            CERRAR SESIÓN
          </button>

        </div>
      </div>
    </main>
  )
}

export default Perfil