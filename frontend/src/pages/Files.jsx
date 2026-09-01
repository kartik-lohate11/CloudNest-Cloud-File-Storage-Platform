import { useState } from "react";
import { Folder, HardDrive, Upload, Filter, List, LayoutGrid, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FileCard from "../components/FileCard";
import FileTable from "../components/FileTable";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import ShareModal from "../components/ShareModal";
import UserProfile from "../components/UserProfile";
import Pagination from "../components/Pagination";
import { useFiles } from "../context/FileContext";

const Files = () => {
  const {
    files,
    viewMode,
    setViewMode,
    openModal,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    fetchUserFiles,
  } = useFiles();

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen flex relative overflow-x-hidden">
      <div className="abstract-bg" />
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full relative z-10">
        <Header />

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Header & Upload Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
                Computer & Cloud Directory
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Explore your cloud directory and uploaded storage volumes.
              </p>
            </div>

            <button
              onClick={() => openModal("upload")}
              className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload to Directory</span>
            </button>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing <strong className="text-white">{files.length}</strong> items (Total: {totalElements} files)
            </span>

            <div className="flex items-center glass-card rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-gray-400 hover:text-white"
                }`}
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
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Files List / Grid */}
          {viewMode === "table" ? (
            <FileTable files={files} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
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
        </div>
      </main>

      <UploadModal />
      <FileDetailsModal />
      <ShareModal />
      <UserProfile />
    </div>
  );
};

export default Files;
