// COMPONENTE Login
// Un componente en React es una función JavaScript que devuelve JSX.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setUsuario }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "administrator@gmail.com") {
      setUsuario({ email, rol: "admin" });
      navigate("/admin/generos");
    } else if (email === "juan@gmail.com") {
      setUsuario({ email, rol: "usuario" });
      navigate("/");
    } else {
      setError("Correo no reconocido.");
    }
  };

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
            <div className="flex justify-between items-center mb-4">
              <label className="font-serif text-2xl text-[#351118]">
                Contraseña
              </label>

              <Link
                to="/recuperar-password"
                className="text-sm text-[#4b385c] hover:underline"
              >
                Olvidé mi contraseña
              </Link>
            </div>

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
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#4b385c] text-white py-4 text-sm tracking-widest font-semibold hover:bg-[#382943] transition"
          >
            INICIAR SESIÓN
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
  );
}

export default Login;
