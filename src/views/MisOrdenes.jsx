import OrdenCard from "../components/OrdenCard";
import Quote from "../components/Quote";

function MisOrdenes() {

 // Simulación.
 // Más adelante esto vendrá del backend.

 const ordenes = [

   {
     id: 1,
     codigo: "#149",
     fecha: "14 de Octubre, 2023",
     estado: "ENTREGADO",

     libros: [
       {
         id: 1,
         titulo: "Principia Mathematica",
         autor: "Isaac Newton",
         imagen: "/principia.jpg"
       },

       {
         id: 2,
         titulo: "Meditaciones",
         autor: "Marco Aurelio",
         imagen: "/meditaciones.jpg"
       }
     ]
   },

   {
     id: 2,
     codigo: "#BM-811023",
     fecha: "28 de Octubre, 2023",
     estado: "EN CAMINO",

     libros: [
       {
         id: 3,
         titulo: "La Divina Comedia",
         autor: "Dante Alighieri",
         imagen: "/divina.jpg"
       }
     ]
   }
 ];

 return (

   <main className="bg-[#faf7f5] px-4 py-10">

     <section className="max-w-6xl mx-auto">

       <h1 className="font-serif text-6xl text-[#351118]">
         Mis Ordenes
       </h1>

       <p className="text-gray-500 mt-4 mb-10 max-w-2xl">
         Explore la crónica de sus adquisiciones literarias.
       </p>

       <div className="space-y-8">

         {ordenes.map((orden) => (

           <OrdenCard
             key={orden.id}
             codigo={orden.codigo}
             fecha={orden.fecha}
             estado={orden.estado}
             libros={orden.libros}
             boton={
               <button className="bg-[#4b385c] text-white px-6 py-2">
                 Ver detalles
               </button>
             }
           />

         ))}

       </div>

       <div className="my-16">

         <Quote
           texto="Una casa sin libros es como un cuerpo sin alma."
           autor="Cicerón"
         />

       </div>

     </section>

   </main>
 );
}

export default MisOrdenes;
