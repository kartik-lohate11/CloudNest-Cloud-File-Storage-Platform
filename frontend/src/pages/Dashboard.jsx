import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  List,
  LayoutGrid,
  Info,
  Sparkles,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Search,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StorageCard from "../components/StorageCard";
import FileCard from "../components/FileCard";
import FileTable from "../components/FileTable";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import ShareModal from "../components/ShareModal";
import UserProfile from "../components/UserProfile";
import Pagination from "../components/Pagination";
import { useFiles } from "../context/FileContext";

const Dashboard = () => {
  const {
    files,
    isLoadingFiles,
    storageStats,
    searchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    sortBy,
    viewMode,
    setViewMode,
    openModal,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    fetchUserFiles,
  } = useFiles();

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Filter and sort files dynamically
  const filteredFiles = files.filter((file) => {
    // Search query filter
    if (
      searchQuery &&
      !file.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (fileTypeFilter !== "all") {
      if (fileTypeFilter === "image" && file.type !== "image") return false;
      if (fileTypeFilter === "video" && file.type !== "video") return false;
      if (
        fileTypeFilter === "document" &&
        file.type !== "document" &&
        file.type !== "pdf"
      )
        return false;
      if (fileTypeFilter === "other" && file.type !== "other") return false;
    }

    return true;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "size-desc") return (b.sizeBytes || 0) - (a.sizeBytes || 0);
    if (sortBy === "size-asc") return (a.sizeBytes || 0) - (b.sizeBytes || 0);
    return 0; // Default order
  });

  // Separate quick access files from main table files for high-fidelity replication of Reference 2
  const quickAccessFiles = files.filter((f) => f.isQuickAccess).slice(0, 4);

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen flex relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="abstract-bg" />

      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full relative z-10">
        {/* Top Header */}
        <Header />

        {/* Canvas Body */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          {/* Storage Summary Cards Section */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Image Files */}
              <StorageCard
                title="Image Files"
                items={`${storageStats.image.count} Items`}
                used={storageStats.image.usedFormatted}
                total="5 GB"
                type="image"
                percent={storageStats.image.percent}
                onClick={() =>
                  setFileTypeFilter(
                    fileTypeFilter === "image" ? "all" : "image"
                  )
                }
              />

              {/* Video Files */}
              <StorageCard
                title="Video Files"
                items={`${storageStats.video.count} Items`}
                used={storageStats.video.usedFormatted}
                total="5 GB"
                type="video"
                percent={storageStats.video.percent}
                onClick={() =>
                  setFileTypeFilter(
                    fileTypeFilter === "video" ? "all" : "video"
                  )
                }
              />

              {/* Document Files */}
              <StorageCard
                title="Document Files"
                items={`${storageStats.document.count} Items`}
                used={storageStats.document.usedFormatted}
                total="5 GB"
                type="document"
                percent={storageStats.document.percent}
                onClick={() =>
                  setFileTypeFilter(
                    fileTypeFilter === "document" ? "all" : "document"
                  )
                }
              />

              {/* Other Files */}
              <StorageCard
                title="Other Files"
                items={`${storageStats.other.count} Items`}
                used={storageStats.other.usedFormatted}
                total="5 GB"
                type="other"
                percent={storageStats.other.percent}
                onClick={() =>
                  setFileTypeFilter(
                    fileTypeFilter === "other" ? "all" : "other"
                  )
                }
              />
            </div>

            {/* Nuages+ Promo Banner */}
            <div className="mt-4 flex items-center gap-2 text-xs md:text-sm text-gray-400">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Free tier storage quota: <strong>5.00 GB max capacity</strong>.</span>
              <button
                onClick={() => openModal("upload")}
                className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Upload more files
              </button>
            </div>
          </section>

          {/* Overview Storage Section */}
          <section className="flex-1 flex flex-col relative">
            {/* Section Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
                    Overview Storage
                  </h3>
                  {fileTypeFilter !== "all" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase">
                      {fileTypeFilter}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  Total <strong className="text-white">{storageStats?.overall?.totalElements || totalElements}</strong> files stored ({storageStats?.overall?.usedFormatted || "0 KB"} / 5 GB used)
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className={`btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                      fileTypeFilter !== "all"
                        ? "bg-blue-600/30 text-blue-300 border-blue-500/40"
                        : ""
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="capitalize">
                      {fileTypeFilter === "all" ? "Filter" : fileTypeFilter}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {filterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-2xl border border-white/10 py-2 z-30 animate-in fade-in duration-150">
                      {[
                        { label: "All Files", value: "all" },
                        { label: "Images Only", value: "image" },
                        { label: "Videos Only", value: "video" },
                        { label: "Documents Only", value: "document" },
                        { label: "Others Only", value: "other" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setFileTypeFilter(item.value);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                            fileTypeFilter === item.value
                              ? "bg-white/10 text-white font-semibold"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center glass-card rounded-xl p-1 border border-white/10">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? "bg-white/10 text-white shadow-sm border border-white/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white/10 text-white shadow-sm border border-white/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Display Files */}
            {isLoadingFiles ? (
              <div className="flex-1 min-h-[220px] rounded-2xl border border-white/10 bg-white/5 p-12 flex flex-col items-center justify-center text-center animate-pulse">
                <div className="w-9 h-9 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-white font-medium text-sm">Searching & filtering files...</p>
                <p className="text-xs text-gray-400 mt-1">Fetching records from database...</p>
              </div>
            ) : sortedFiles.length === 0 ? (
              <div className="flex-1 min-h-[220px] rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <FolderOpen className="w-7 h-7 text-gray-500" />
                </div>
                <h4 className="text-white font-semibold text-base mb-1">No files found</h4>
                <p className="text-gray-400 text-sm max-w-sm">
                  No matching files found. Try adjusting your search query or filter.
                </p>
              </div>
            ) : viewMode === "table" ? (
              <FileTable files={sortedFiles} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={(page) => fetchUserFiles(page)}
            />
          </section>
        </div>
      </main>

      {/* Global Interactive Modals */}
      <UploadModal />
      <FileDetailsModal />
      <ShareModal />
      <UserProfile />
    </div>
  );
};

export default Dashboard;
