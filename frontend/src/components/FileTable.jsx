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
  Inbox,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const FileTableRow = ({ file }) => {
  const { openModal, downloadFile, archiveFile } = useFiles();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const getFileStyle = () => {
    switch (file.type) {
      case "image":
        return { icon: ImageIcon, color: "text-orange-400" };
      case "video":
        return { icon: Video, color: "text-emerald-400" };
      case "pdf":
        return { icon: FileText, color: "text-amber-500" };
      case "document":
        return { icon: FileText, color: "text-amber-400" };
      case "other":
      default:
        return {
          icon: file.extension === "apk" ? FileCode : Folder,
          color: "text-blue-400",
        };
    }
  };

  const { icon: Icon, color } = getFileStyle();

  return (
    <tr
      onClick={() => openModal("details", file)}
      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
    >
      {/* File Name */}
      <td className="py-4 px-6 flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="font-medium text-sm text-white group-hover:text-blue-300 transition-colors truncate max-w-xs md:max-w-md">
          {file.name}
        </span>
      </td>

      {/* Date Upload */}
      <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
        {file.uploadDate}
      </td>

      {/* Last Update */}
      <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
        {file.updated || "Recently"}
      </td>

      {/* File Size */}
      <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
        {file.size}
      </td>

      {/* Actions */}
      <td
        className="py-4 px-6 text-right relative"
        onClick={(e) => e.stopPropagation()}
        ref={menuRef}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="File Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-6 top-10 w-44 glass-card rounded-xl py-1.5 shadow-2xl border border-white/15 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setMenuOpen(false);
                openModal("details", file);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Details</span>
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
      </td>
    </tr>
  );
};

const FileTable = ({ files = [] }) => {
  if (files.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <Inbox className="w-7 h-7 text-gray-500" />
        </div>
        <h4 className="text-white font-semibold text-base mb-1">No files found</h4>
        <p className="text-gray-400 text-sm max-w-sm">
          No documents match your current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-400 font-semibold uppercase tracking-wider bg-white/5">
              <th className="py-4 px-6">File Name</th>
              <th className="py-4 px-6">Date Upload</th>
              <th className="py-4 px-6">Last Update</th>
              <th className="py-4 px-6">File Size</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {files.map((file) => (
              <FileTableRow key={file.id} file={file} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
