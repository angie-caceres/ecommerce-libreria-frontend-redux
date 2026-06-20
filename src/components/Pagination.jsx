// Componente reutilizable de paginación
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "elementos",
  onPageChange,
}) {
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    if (currentPage > 3) pages.push("...");
    if (currentPage > 2) pages.push(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages)
      pages.push(currentPage);
    if (currentPage < totalPages - 1)
      pages.push(currentPage + 1);
    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return [...new Set(pages)];
  };

  const inicio =
    totalItems === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const fin = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  return (
  <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      <button
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-800 bg-white"
      >
        {currentPage}
      </button>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  </div>
);
}