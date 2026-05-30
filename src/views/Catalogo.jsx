// VISTA — página que muestra todos los libros disponibles
// Renderizando componentes dentro de otros

import { useState } from 'react'
import LibroCard from '../components/LibroCard'

// DATOS hardcodeados
const libros = [
      {
    id: 1,
    titulo: 'Amanecer en la cosecha',
    autor: 'Suzanne Collins',
    editorial: 'Planeta',
    hojas: 460,
    genero: 'Distopía',
    precio: 40000,
    descripcion: 'Una obra maestra definitiva de la filosofía moderna, esta primera edición limitada está encuadernada en cuero de ternera de color burdeos profundo, obtenido de forma ética. Con bordes de pan de oro de 24 quilates dorados a mano y un prólogo del descendiente directo del autor, representa la cumbre de la fabricación artesanal de libros.',
    imagen: '/libros/juegos.png',
    },
    {
    id: 2,
    titulo: '1984',
    autor: 'George Orwell',
    editorial: 'Planeta',
    hojas: 600,
    genero: 'Distopía',
    precio: 18000,
    descripcion: 'Una obra maestra definitiva de la filosofía moderna, esta primera edición limitada está encuadernada en cuero de ternera de color burdeos profundo, obtenido de forma ética. Con bordes de pan de oro de 24 quilates dorados a mano y un prólogo del descendiente directo del autor, representa la cumbre de la fabricación artesanal de libros.',
    imagen: '/libros/1984.jpg'
    },
    {
    id: 3,
    titulo: 'El Hobbit',
    autor: 'J.R.R. Tolkien',
    editorial: 'Minotauro',
    hojas: 320,
    genero: 'Fantasía',
    precio: 25000,
    descripcion: 'Una obra maestra definitiva de la filosofía moderna, esta primera edición limitada está encuadernada en cuero de ternera de color burdeos profundo, obtenido de forma ética. Con bordes de pan de oro de 24 quilates dorados a mano y un prólogo del descendiente directo del autor, representa la cumbre de la fabricación artesanal de libros.',
    imagen: '/libros/hobbit.jpg'
    },
    {
    id: 4,
    titulo: 'Drácula',
    autor: 'Bram Stoker',
    editorial: 'Penguin',
    genero: 'Terror',
    precio: 22000,
    hojas: 480,
    descripcion: 'Una obra maestra definitiva de la filosofía moderna, esta primera edición limitada está encuadernada en cuero de ternera de color burdeos profundo, obtenido de forma ética. Con bordes de pan de oro de 24 quilates dorados a mano y un prólogo del descendiente directo del autor, representa la cumbre de la fabricación artesanal de libros.',
    imagen: '/libros/dracula.jpg'
    },
    {
    id: 5,
    titulo: 'Crimen y Castigo',
    autor: 'Fiódor Dostoyevski',
    editorial: 'Alianza',
    hojas: 720,
    genero: 'Clásico',
    precio: 28000,
    descripcion: 'Novela fundamental de la literatura rusa que explora la culpa, la moral y la redención.',
    imagen: '/libros/crimen.jpg'
    },
    {
    id: 6,
    titulo: 'Orgullo y Prejuicio',
    autor: 'Jane Austen',
    editorial: 'Penguin',
    hojas: 430,
    genero: 'Romance',
    precio: 21000,
    descripcion: 'Historia clásica sobre el amor, el orgullo y las diferencias sociales en la Inglaterra del siglo XIX.',
    imagen: '/libros/orgullo.jpg'
    },
    {
    id: 7,
    titulo: 'Fahrenheit 451',
    autor: 'Ray Bradbury',
    editorial: 'Minotauro',
    hojas: 310,
    genero: 'Distopía',
    precio: 19000,
    descripcion: 'Una sociedad donde los libros están prohibidos y los bomberos los queman.',
    imagen: '/libros/fahrenheit.jpg'
    },
    {
    id: 8,
    titulo: 'El Nombre del Viento',
    autor: 'Patrick Rothfuss',
    editorial: 'Plaza & Janés',
    hojas: 880,
    genero: 'Fantasía',
    precio: 38000,
    descripcion: 'Las memorias de Kvothe, músico, mago y leyenda viviente.',
    imagen: '/libros/nombre-viento.jpg'
    },
    {
    id: 9,
    titulo: 'It',
    autor: 'Stephen King',
    editorial: 'Debolsillo',
    hojas: 1500,
    genero: 'Terror',
    precio: 45000,
    descripcion: 'Una presencia maligna despierta cada veintisiete años para sembrar el terror.',
    imagen: '/libros/it.jpg'
    },
    {
    id: 10,
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    editorial: 'Salamandra',
    hojas: 120,
    genero: 'Infantil',
    precio: 12000,
    descripcion: 'Un clásico universal sobre la amistad, la imaginación y el sentido de la vida.',
    imagen: '/libros/principito.jpg'
    },
    {
    id: 11,
    titulo: 'La República',
    autor: 'Platón',
    editorial: 'Gredos',
    hojas: 520,
    genero: 'Filosofía',
    precio: 26000,
    descripcion: 'Diálogo filosófico sobre la justicia, el conocimiento y la organización ideal del Estado.',
    imagen: '/libros/republica.jpg'
    },
    {
    id: 12,
    titulo: 'Más allá del bien y del mal',
    autor: 'Friedrich Nietzsche',
    editorial: 'Alianza',
    hojas: 340,
    genero: 'Filosofía',
    precio: 24000,
    descripcion: 'Una crítica profunda a la moral tradicional y a los valores de la cultura occidental.',
    imagen: '/libros/nietzsche.jpg'
    }
]

function Catalogo() {

  // HOOK useState — guarda el valor máximo del filtro de precio
  // Estados locales y props - useState
  const [precioMax, setPrecioMax] = useState(50000)

  // HOOK useState — guarda el autor seleccionado
  // Estados locales y props - useState)
  const [autorSeleccionado, setAutorSeleccionado] = useState('')

// HOOK useState — guarda la editorial seleccionada
// Estados locales y props - useState
  const [editorialSeleccionada, setEditorialSeleccionada] = useState('')

  // HOOK useState — guarda los géneros marcados
  // Se utiliza un array porque pueden seleccionarse varios géneros
  // Estados locales y props - useState
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])

  // Se obtienen géneros únicos para construir los checkboxes
  // Renderizado de listas
  const generos = [...new Set(libros.map(libro => libro.genero))]

  // Se obtienen autores únicos para construir el select
  // Renderizado de listas
  const autores = [...new Set(libros.map(libro => libro.autor))]

  // Se obtienen editoriales únicas para construir los botones
  // Renderizado de listas
  const editoriales = [...new Set(libros.map(libro => libro.editorial))]

  // EVENTO — agrega o quita géneros seleccionados
  // Estados locales y props - Eventos
  const handleGenero = (genero) => {

    if (generosSeleccionados.includes(genero)) {

      setGenerosSeleccionados(
        generosSeleccionados.filter(g => g !== genero)
      )

    } else {

      setGenerosSeleccionados([
        ...generosSeleccionados,
        genero
      ])

    }
  }

  // FILTRADO de datos
  // Cada vez que cambia un estado React vuelve a renderizar
  // utilizando el DOM virtual
  // Renderizado condicional
  const librosFiltrados = libros.filter(libro => {

    const cumplePrecio =
      libro.precio <= precioMax

    const cumpleAutor =
      autorSeleccionado === '' ||
      libro.autor === autorSeleccionado

    const cumpleEditorial =
        editorialSeleccionada === '' ||
        libro.editorial === editorialSeleccionada

    const cumpleGenero =
      generosSeleccionados.length === 0 ||
      generosSeleccionados.includes(libro.genero)

    return (
      cumplePrecio &&
      cumpleAutor &&
      cumpleEditorial &&
      cumpleGenero
    )
  })

  return (
    <div className="bg-[#FCF9F8] min-h-screen px-12 py-10">

      <h1 className="text-4xl font-bold text-[#2d2640] mb-10" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
        Catálogo completo
      </h1>

    <p className="text-sm text-gray-500 mb-10 max-w-2xl" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
    Tu próxima obsesión literaria podría estar a una página de distancia.
    </p>

      <div className="flex gap-12">

        {/* PANEL DE FILTROS */}

        <aside className="w-72 bg-white p-6 shadow-sm rounded">

          <h2 className="text-xl text-[#2d2640] mb-6">
            Filtrar por
          </h2>

          {/* FILTRO POR GÉNERO */}

          <div className="mb-8">

            <h3 className="font-medium mb-3">
              Géneros
            </h3>

            {/* RENDERIZADO DE LISTA con map()
                Renderizado de listas */}

            {generos.map(genero => (

              <label
                key={genero}
                className="flex items-center gap-2 mb-2"
              >

                <input
                  type="checkbox"

                  checked={
                    generosSeleccionados.includes(genero)
                  }

                  onChange={() =>
                    handleGenero(genero)
                  }
                />

                {genero}

              </label>

            ))}

          </div>

          {/* FILTRO POR PRECIO Máximo*/}

          <div className="mb-8">

            <h3 className="font-medium mb-3">
              Precio máximo
            </h3>

            <input
              type="range"

              min="0"
              max="50000"
              step="1000"

              value={precioMax}

              onChange={(e) =>
                setPrecioMax(Number(e.target.value))
              }

              className="w-full"
            />

            <p className="text-sm text-gray-500 mt-2">
              Hasta ${precioMax.toLocaleString()}
            </p>

          </div>

          {/* FILTRO POR AUTOR */}

          <div>

            <h3 className="font-medium mb-3">
              Autor
            </h3>

            <select

              value={autorSeleccionado}

              onChange={(e) =>
                setAutorSeleccionado(e.target.value)
              }

              className="w-full border border-gray-300 rounded p-2"
            >

              <option value="">
                Todos
              </option>

              {/* RENDERIZADO DE LISTA con map() */}

              {autores.map(autor => (

                <option
                  key={autor}
                  value={autor}
                >
                  {autor}
                </option>

              ))}

            </select>

          </div>

        {/* FILTRO POR EDITORIAL */}

            <div className="mt-8">

            <h3 className="font-medium mb-3">
                Editorial
            </h3>

            <div className="flex flex-wrap gap-2">

                {/* RENDERIZADO DE LISTA con map()
                   Renderizado de listas */}

                {editoriales.map(editorial => (

                <button
                    key={editorial}

                    onClick={() =>
                    setEditorialSeleccionada(
                        editorialSeleccionada === editorial
                        ? ''
                        : editorial
                    )
                    }

                    className={
                    editorialSeleccionada === editorial
                        ? 'bg-[#7B5B98] text-white px-3 py-2 rounded text-sm transition'
                        : 'bg-white text-[#7B5B98] border border-[#7B5B98] px-3 py-2 rounded text-sm hover:bg-[#EBE5F2] transition'
                    }
                >
                    {editorial}
                </button>

                ))}

            </div>

            </div>

        </aside>

        {/* GRID DE LIBROS */}

        <section className="flex-1">

          <div className="grid grid-cols-4 gap-8">

            {/* RENDERIZADO DE LISTA con map()
                Se reutiliza el componente LibroCard
                Componentes reutilizables*/}

            {librosFiltrados.map(libro => (

              <LibroCard
                key={libro.id}
                {...libro}
                tieneDetalle={true}
              />

            ))}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Catalogo