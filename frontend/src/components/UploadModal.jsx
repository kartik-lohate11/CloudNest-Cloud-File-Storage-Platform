import { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertTriangle,
  Folder,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const UploadModal = () => {
  const { modalState, closeModal, uploadFiles, storageStats } = useFiles();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
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
    setUploadError("");
    const updated = [...selectedFiles, ...newFiles];
    if (updated.length > 10) {
      setUploadError("Maximum 10 files can be uploaded at a time.");
    }
    setSelectedFiles(updated.slice(0, 10));
  };

  const removeFile = (index) => {
    setUploadError("");
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) return;
    setUploadError("");

    // 1. Check max 10 files
    if (selectedFiles.length > 10) {
      setUploadError("Maximum 10 files can be uploaded at a time.");
      return;
    }

    const MAX_SINGLE_FILE_BYTES = 100 * 1024 * 1024; // 100 MB
    const MAX_BATCH_BYTES = 100 * 1024 * 1024; // 100 MB

    // 2. Check individual file sizes <= 100 MB
    for (const f of selectedFiles) {
      if (f.size > MAX_SINGLE_FILE_BYTES) {
        const fileMB = (f.size / (1024 * 1024)).toFixed(2);
        setUploadError(
          `File "${f.name}" (${fileMB} MB) exceeds the maximum allowed size of 100 MB per file.`
        );
        return;
      }
    }

    // 3. Check total batch size <= 100 MB
    const newFilesSizeBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);
    if (newFilesSizeBytes > MAX_BATCH_BYTES) {
      const batchMB = (newFilesSizeBytes / (1024 * 1024)).toFixed(2);
      setUploadError(
        `Batch upload limit exceeded! Maximum 100 MB per batch allowed (Your selected batch totals ${batchMB} MB).`
      );
      return;
    }

    // 4. Check total user 5 GB quota
    const usedBytes = storageStats?.overall?.usedBytes || 0;
    const maxBytes = storageStats?.overall?.maxBytes || 5 * 1024 * 1024 * 1024;

    if (usedBytes + newFilesSizeBytes > maxBytes) {
      const remainingBytes = Math.max(0, maxBytes - usedBytes);
      const remainingMB = (remainingBytes / (1024 * 1024)).toFixed(2);
      const newFilesMB = (newFilesSizeBytes / (1024 * 1024)).toFixed(2);
      setUploadError(
        `Storage limit exceeded! You have ${remainingMB} MB remaining of your 5 GB limit. Your selected files total ${newFilesMB} MB.`
      );
      return;
    }

    setIsUploading(true);

    // Upload files to MinIO storage via backend API
    uploadFiles(selectedFiles)
      .then(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setSelectedFiles([]);
          closeModal();
        }, 1000);
      })
      .catch((err) => {
        setIsUploading(false);
        const errMsg = err?.response?.data?.message || err?.message || "Storage limit exceeded or upload failed.";
        setUploadError(errMsg);
      });
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
            Max 10 files per batch • Up to 100 MB batch size • 5 GB account limit
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

        {/* Upload Error / Quota Exceeded Alert */}
        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Upload Success Feedback */}
        {uploadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Files uploaded successfully to CloudNest!</span>
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
