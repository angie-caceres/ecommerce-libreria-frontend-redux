// VISTA — página Quiénes Somos
// (PDF: Exposición de experto - Renderizando un componente dentro de otro)
import Quote from '../components/Quote'

function QuienesSomos() {
  return (
    <div className="bg-[#FCF9F8] min-h-screen">

      <div className="max-w-4xl mx-auto px-12 py-16">

        <h1
          className="text-4xl text-center text-[#4E3B67] mb-12"
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          Quiénes Somos
        </h1>

        <div className="bg-white border border-gray-200 p-12">

          {/* Descripción */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            En "Entre Letras" creemos que la lectura tiene el poder de inspirar, enseñar y conectar personas. Nacimos con el objetivo de crear una experiencia simple, accesible y moderna para todos los amantes de los libros, ofreciendo una plataforma donde lectores y vendedores puedan encontrarse en un mismo lugar.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-10">
            Nuestra tienda reúne una amplia variedad de títulos, géneros y autores, permitiendo descubrir nuevas historias de manera rápida, segura y personalizada.
          </p>

          {/* Misión y valores */}
          <h2
            className="text-2xl text-[#4E3B67] mb-6"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Nuestra Misión y Valores
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Brindar una experiencia de compra online intuitiva y confiable, acercando libros a más personas y fomentando el hábito de la lectura a través de la tecnología. Buscamos brindar a nuestros usuarios una experiencia de compra simple, segura y accesible, acercando la lectura a más personas a través de una plataforma moderna e intuitiva. Nuestra misión es conectar lectores con historias que inspiren, enseñen y acompañen, ofreciendo una amplia variedad de libros y una navegación cómoda para cada usuario. Nos comprometemos a trabajar con pasión por la lectura, priorizando la confianza, la innovación y la calidad del servicio. Creemos en la importancia de construir una comunidad donde lectores, autores y vendedores puedan encontrarse en un mismo espacio, fomentando el acceso al conocimiento y la cultura mediante la tecnología.
          </p>

        </div>
      </div>

      {/* COMPONENTE Quote — reutilizable
          (PDF: Exposición de experto - Componentes reutilizables) */}
      <Quote />

    </div>
  )
}

export default QuienesSomos