import { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  FileText,
  Video,
  FileCode,
  Folder,
  MoreVertical,
  Download,
  Edit2,
  Trash2,
  Eye,
  Archive,
  Share2,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const FileCard = ({ file }) => {
  const { openModal, downloadFile, archiveFile } = useFiles();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Helper to determine file icon and color
  const getFileStyle = () => {
    switch (file.type) {
      case "image":
        return {
          icon: ImageIcon,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
        };
      case "video":
        return {
          icon: Video,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        };
      case "pdf":
        return {
          icon: FileText,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        };
      case "document":
        return {
          icon: FileText,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
        };
      case "other":
      default:
        return {
          icon: file.extension === "apk" ? FileCode : Folder,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        };
    }
  };

  const { icon: Icon, color } = getFileStyle();

  return (
    <div
      onClick={() => openModal("details", file)}
      className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer glass-card-hover group relative border border-white/10"
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="overflow-hidden">
          <h4
            className="font-medium text-white text-sm truncate group-hover:text-blue-300 transition-colors"
            title={file.name}
          >
            {file.name}
          </h4>
          <p className="text-gray-400 text-xs mt-0.5">{file.size}</p>
        </div>
      </div>

      {/* Action Menu */}
      <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-8 w-44 glass-card rounded-xl py-1.5 shadow-2xl border border-white/15 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setMenuOpen(false);
                openModal("details", file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>File Details</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                downloadFile(file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                openModal("share", file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Share</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                openModal("rename", file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Rename</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                archiveFile(file.id);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400" />
              <span>Archive</span>
            </button>

            <div className="h-[1px] bg-white/10 my-1" />

            <button
              onClick={() => {
                setMenuOpen(false);
                openModal("delete", file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;
