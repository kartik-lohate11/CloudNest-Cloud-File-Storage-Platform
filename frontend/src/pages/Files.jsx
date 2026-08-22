import { useState } from "react";
import { Folder, HardDrive, Upload, Filter, List, LayoutGrid, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FileCard from "../components/FileCard";
import FileTable from "../components/FileTable";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Files = () => {
  const { files, viewMode, setViewMode, openModal, selectedFolder, setSelectedFolder } =
    useFiles();
  const [activeTab, setActiveTab] = useState("all");

  const folders = [
    { name: "All Folders", id: "all", count: files.length },
    {
      name: "Personal Collections",
      id: "personal",
      count: files.filter((f) => f.location.includes("Personal")).length,
    },
    {
      name: "School Collections",
      id: "school",
      count: files.filter((f) => f.location.includes("School")).length,
    },
    {
      name: "Telkom Collections",
      id: "telkom",
      count: files.filter((f) => f.location.includes("Telkom")).length,
    },
    {
      name: "Unicorn Collections",
      id: "unicorn",
      count: files.filter((f) => f.location.includes("Unicorn")).length,
    },
    {
      name: "Tokopedia Collections",
      id: "tokopedia",
      count: files.filter((f) => f.location.includes("Tokopedia")).length,
    },
  ];

  const displayedFiles = files.filter((file) => {
    if (activeTab === "all") return true;
    if (activeTab === "personal") return file.location.includes("Personal");
    if (activeTab === "school") return file.location.includes("School");
    if (activeTab === "telkom") return file.location.includes("Telkom");
    if (activeTab === "unicorn") return file.location.includes("Unicorn");
    if (activeTab === "tokopedia") return file.location.includes("Tokopedia");
    return true;
  });

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
                Explore local sync folders, remote drive volumes, and workspace trees.
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

          {/* Folder Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveTab(folder.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === folder.id
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm"
                    : "glass-card text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{folder.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-gray-300">
                  {folder.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing <strong className="text-white">{displayedFiles.length}</strong> items
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
            <FileTable files={displayedFiles} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </main>

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Files;
