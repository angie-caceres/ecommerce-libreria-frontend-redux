// COMPONENTE OrdenCard
// Representa una orden individual.
// Teoría:
// Un componente encapsula una parte de la interfaz.
// React construye la UI combinando componentes más pequeños.

function OrdenCard({
 codigo,
 fecha,
 estado,
 libros,
 boton
}) {

 return (

   <article className="bg-white border border-[#ead8d4] p-6">

     {/* Cabecera de la orden */}
     <div className="flex justify-between mb-8">

       <div>
         <p className="text-xs uppercase text-gray-500">
           Código de orden
         </p>

         <h2 className="text-4xl font-serif text-[#351118]">
           {codigo}
         </h2>
       </div>

       <div>
         <p className="text-xs uppercase text-gray-500">
           Fecha
         </p>

         <p>{fecha}</p>
       </div>

       <div>
         <p className="text-xs uppercase text-gray-500">
           Estado
         </p>

         <p className="font-semibold text-yellow-700">
           {estado}
         </p>
       </div>

     </div>

     <div className="border-t border-[#ead8d4] pt-6">

       <p className="text-xs uppercase text-gray-500 mb-4">
         Artículos en este pedido
       </p>

       <div className="grid md:grid-cols-2 gap-4">

         {libros.map((libro) => (

           <div
             key={libro.id}
             className="bg-[#faf7f5] p-3 flex gap-4"
           >

             {libro.imagen && (
                <img
                  src={libro.imagen}
                  alt={libro.titulo}
                  className="w-14 h-20 object-cover"
                />
              )}

             <div>

               <h3 className="font-serif text-xl text-[#351118]">
                 {libro.titulo}
               </h3>

               <p className="text-gray-500 text-sm">
                 {libro.autor}
               </p>

             </div>

           </div>

         ))}

       </div>

     </div>

     <div className="flex justify-end gap-4 mt-6">
       {boton}
     </div>

   </article>
 );
}

export default OrdenCard;
