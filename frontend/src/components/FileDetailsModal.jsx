import { useState } from "react";
import {
  X,
  Download,
  Edit2,
  Trash2,
  Folder,
  Image as ImageIcon,
  FileText,
  Video,
  FileCode,
  Archive,
  User,
  Clock,
  HardDrive,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const FileDetailsModal = () => {
  const {
    modalState,
    closeModal,
    downloadFile,
    openModal,
    deleteFile,
    archiveFile,
    renameFile,
  } = useFiles();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  if (
    !modalState.isOpen ||
    (modalState.type !== "details" &&
      modalState.type !== "rename" &&
      modalState.type !== "delete")
  ) {
    return null;
  }

  const file = modalState.data;
  if (!file) return null;

  const getFileIconInfo = () => {
    switch (file.type) {
      case "image":
        return {
          icon: ImageIcon,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          label: "Image File (JPEG/PNG)",
        };
      case "video":
        return {
          icon: Video,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          label: "Video Media (MP4/MOV)",
        };
      case "pdf":
        return {
          icon: FileText,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: "PDF Document",
        };
      case "document":
        return {
          icon: FileText,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: "Word / Document File",
        };
      case "other":
      default:
        return {
          icon: file.extension === "apk" ? FileCode : Folder,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          label: "Application / Binary Data",
        };
    }
  };

  const iconInfo = getFileIconInfo();
  const IconComponent = iconInfo.icon;

  // Handle Delete Confirmation Screen
  if (modalState.type === "delete") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
        <div
          className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-red-500/30 relative animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight font-['Hanken_Grotesk'] mb-2">
            Delete this file?
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            <strong className="text-white font-medium">{file.name}</strong> will be moved to
            the Trash folder. You can restore it anytime within 30 days.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteFile(file.id)}
              className="px-5 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-500/20 transition-all"
            >
              Move to Trash
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Rename Modal Screen
  if (modalState.type === "rename" || isRenaming) {
    const handleRenameSubmit = (e) => {
      e.preventDefault();
      if (newFileName.trim()) {
        renameFile(file.id, newFileName.trim());
        setIsRenaming(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
        <form
          onSubmit={handleRenameSubmit}
          className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setIsRenaming(false);
              closeModal();
            }}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4">
            <Edit2 className="w-6 h-6 text-amber-400" />
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight font-['Hanken_Grotesk'] mb-2">
            Rename File
          </h3>
          <p className="text-gray-400 text-xs mb-4">
            Enter a new name for this file including its extension.
          </p>

          <input
            type="text"
            defaultValue={file.name}
            onChange={(e) => setNewFileName(e.target.value)}
            autoFocus
            className="w-full dark-input rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 mb-6"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsRenaming(false);
                closeModal();
              }}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Standard File Details Modal View (Exact match to Reference 2)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 border-b border-white/10 pb-5">
          <div
            className={`w-16 h-16 rounded-2xl ${iconInfo.bg} border ${iconInfo.border} flex items-center justify-center shrink-0 shadow-inner`}
          >
            <IconComponent className={`w-8 h-8 ${iconInfo.color}`} />
          </div>
          <div className="overflow-hidden pr-6">
            <h3
              className="text-lg font-bold text-white truncate tracking-tight font-['Hanken_Grotesk']"
              title={file.name}
            >
              {file.name}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{iconInfo.label}</p>
          </div>
        </div>

        {/* Modal Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Size</span>
            </div>
            <div className="text-white text-sm font-semibold">{file.size}</div>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Date Added</span>
            </div>
            <div className="text-white text-sm font-semibold">{file.uploadDate}</div>
          </div>

          <div className="col-span-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              <Folder className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location</span>
            </div>
            <div className="text-white text-xs font-medium truncate">
              {file.location || "/Personal File/Personal Collections"}
            </div>
          </div>

          <div className="col-span-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Owner</span>
            </div>
            <div className="text-white text-xs font-medium">
              {file.owner || "Kartik Lohate"} (Administrator)
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          {/* Download Full Width */}
          <button
            onClick={() => downloadFile(file)}
            className="w-full btn-gradient text-white rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg border border-transparent active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setIsRenaming(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Rename</span>
            </button>

            <button
              onClick={() => archiveFile(file.id)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400" />
              <span>Archive</span>
            </button>

            <button
              onClick={() => openModal("delete", file)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;
