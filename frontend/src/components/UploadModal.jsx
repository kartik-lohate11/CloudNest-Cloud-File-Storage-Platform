import { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Trash2,
  Folder,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const UploadModal = () => {
  const { modalState, closeModal, uploadFiles } = useFiles();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetFolder, setTargetFolder] = useState("/Personal File/Personal Collections");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!modalState.isOpen || modalState.type !== "upload") return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    // Simulate network latency / upload progress
    setTimeout(() => {
      uploadFiles(selectedFiles, targetFolder);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFiles([]);
        closeModal();
      }, 1000);
    }, 800);
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
      return <ImageIcon className="w-4 h-4 text-orange-400" />;
    }
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
      return <Video className="w-4 h-4 text-emerald-400" />;
    }
    return <FileText className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-200"
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
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
            Upload Files
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Securely upload documents, images, and videos to CloudNest.
          </p>
        </div>

        {/* Folder Destination Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            Destination Location
          </label>
          <div className="relative">
            <Folder className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="w-full dark-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-white appearance-none cursor-pointer focus:border-blue-500"
            >
              <option value="/Personal File/Personal Collections" className="bg-[#121320] text-white">
                Personal File / Personal Collections
              </option>
              <option value="/Personal File/School Collections" className="bg-[#121320] text-white">
                Personal File / School Collections
              </option>
              <option value="/Workspace File/Telkom Collections" className="bg-[#121320] text-white">
                Workspace File / Telkom Collections
              </option>
              <option value="/Workspace File/Unicorn Collections" className="bg-[#121320] text-white">
                Workspace File / Unicorn Collections
              </option>
              <option value="/Workspace File/Tokopedia Collections" className="bg-[#121320] text-white">
                Workspace File / Tokopedia Collections
              </option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            isDragging
              ? "border-blue-400 bg-blue-500/10 scale-[0.99]"
              : "border-white/15 bg-white/5 hover:border-blue-500/50 hover:bg-white/[0.07]"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.png,.jpg,.jpeg,.mp4,.mov,.apk"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7 text-blue-400 animate-pulse" />
          </div>

          <p className="text-white text-sm font-medium mb-1">
            Click to browse or drag and drop files here
          </p>
          <p className="text-gray-400 text-xs">
            Supports PDF, DOCX, XLSX, CSV, PNG, JPG, MP4, ZIP (up to 5 GB)
          </p>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto space-y-2 pr-1">
            <div className="text-xs font-semibold text-gray-400 flex justify-between px-1">
              <span>Ready for upload ({selectedFiles.length})</span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-red-400 hover:underline"
              >
                Clear all
              </button>
            </div>

            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {getFileIcon(file.name)}
                  <span className="text-white font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Success Feedback */}
        {uploadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Files uploaded successfully to {targetFolder}!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={closeModal}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={selectedFiles.length === 0 || isUploading}
            className={`btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center gap-2 transition-all ${
              selectedFiles.length === 0 || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 active:scale-95"
            }`}
          >
            {isUploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload ({selectedFiles.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
