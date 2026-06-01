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
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
      <p className="text-xs text-gray-400">
        Mostrando {inicio} a {fin} de {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          ‹
        </button>

        {getPages().map((page, index) => (
          <button
            key={`${page}-${index}`}
            onClick={() =>
              typeof page === "number" &&
              onPageChange(page)
            }
            disabled={page === "..."}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-purple-600 text-white"
                : page === "..."
                ? "text-gray-400"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
}