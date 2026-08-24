import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage = 0, totalPages = 1, totalElements = 0, pageSize = 20, onPageChange }) => {
  if (!totalElements || totalElements === 0) return null;

  const effectiveTotalPages = Math.max(1, totalPages || Math.ceil(totalElements / pageSize));
  const startItem = totalElements > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(effectiveTotalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-white/10 mt-4">
      {/* Item count text */}
      <div className="text-xs text-gray-400">
        Showing <span className="font-semibold text-white">{startItem}</span> to{" "}
        <span className="font-semibold text-white">{endItem}</span> of{" "}
        <span className="font-semibold text-white">{totalElements}</span> files
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            currentPage === 0
              ? "text-gray-600 cursor-not-allowed opacity-50"
              : "glass-card text-gray-300 hover:text-white hover:bg-white/10 active:scale-95"
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map((pageIdx) => (
          <button
            key={pageIdx}
            onClick={() => onPageChange(pageIdx)}
            className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
              currentPage === pageIdx
                ? "bg-blue-600/40 text-blue-300 border border-blue-500/50 shadow-md scale-105"
                : "glass-card text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {pageIdx + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= effectiveTotalPages - 1}
          className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
            currentPage >= effectiveTotalPages - 1
              ? "text-gray-600 cursor-not-allowed opacity-50"
              : "glass-card text-gray-300 hover:text-white hover:bg-white/10 active:scale-95"
          }`}
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
