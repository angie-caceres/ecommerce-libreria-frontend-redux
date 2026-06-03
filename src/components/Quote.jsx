// COMPONENTE — función JavaScript que devuelve JSX
// Nombre en PascalCase, archivo propio

function Quote() {
  return (
    <section className="py-20 bg-[#FCF9F8] flex flex-col items-center justify-center">

      {/* Frase literaria — texto estático, no necesita estado */}
      <blockquote className="text-center max-w-3xl px-8">
        <p className="text-4xl italic font-serif text-[#4A0E0E] leading-relaxed">
          "Siempre imaginé que el Paraíso sería algún tipo de biblioteca"
        </p>
        <footer className="mt-6 text-sm text-gray-400 uppercase tracking-widest">
          — Cicerón
        </footer>
      </blockquote>

    </section>
  )
}

// EXPORTACIÓN del componente
export default Quote