import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  List,
  LayoutGrid,
  Info,
  Sparkles,
  ChevronRight,
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
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Dashboard = () => {
  const {
    files,
    storageStats,
    searchQuery,
    selectedFolder,
    fileTypeFilter,
    setFileTypeFilter,
    sortBy,
    viewMode,
    setViewMode,
    openModal,
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

    // Folder / Collection filter
    if (selectedFolder !== "all") {
      if (selectedFolder === "school" && !file.location.includes("School"))
        return false;
      if (selectedFolder === "personal" && !file.location.includes("Personal"))
        return false;
      if (selectedFolder === "telkom" && !file.location.includes("Telkom"))
        return false;
      if (selectedFolder === "unicorn" && !file.location.includes("Unicorn"))
        return false;
      if (
        selectedFolder === "tokopedia" &&
        !file.location.includes("Tokopedia")
      )
        return false;
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
                used={`${storageStats.image.usedGB} GB`}
                total="120 GB"
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
                used={`${storageStats.video.usedGB} GB`}
                total="120 GB"
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
                used={`${storageStats.document.usedGB} GB`}
                total="120 GB"
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
                used={`${storageStats.other.usedGB} GB`}
                total="120 GB"
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
              <span>Optimize and expand your storage with Nuages+</span>
              <button
                onClick={() => openModal("upload")}
                className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Try premium now
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
                  {selectedFolder !== "all" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase">
                      {selectedFolder}
                    </span>
                  )}
                  {fileTypeFilter !== "all" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase">
                      {fileTypeFilter}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  Document that you save on our storage
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white text-xs md:text-sm font-medium transition-colors px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 glass-card"
                  >
                    <Filter className="w-4 h-4 text-blue-400" />
                    <span>Filter</span>
                  </button>

                  {filterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 glass-card rounded-xl p-1.5 shadow-2xl border border-white/15 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {[
                        { label: "All Types", value: "all" },
                        { label: "Images only", value: "image" },
                        { label: "Videos only", value: "video" },
                        { label: "Documents only", value: "document" },
                        { label: "Other formats", value: "other" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setFileTypeFilter(item.value);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            fileTypeFilter === item.value
                              ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle (Table / Grid) */}
                <div className="flex items-center glass-card rounded-xl p-1 border border-white/10">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? "bg-white/10 text-white shadow-sm border border-white/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="List View"
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

            {/* Quick Access Cards Row (Matching Reference 2) */}
            {searchQuery === "" && fileTypeFilter === "all" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
                {quickAccessFiles.map((file) => (
                  <FileCard key={`quick-${file.id}`} file={file} />
                ))}
              </div>
            )}

            {/* Main File Table or Grid View */}
            {viewMode === "table" ? (
              <FileTable files={sortedFiles} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Global Interactive Modals */}
      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Dashboard;
