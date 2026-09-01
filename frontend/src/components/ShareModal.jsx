import { useState, useEffect } from "react";
import { X, Share2, Copy, Check, ExternalLink, Loader2, Link2, Globe, Shield } from "lucide-react";
import { useFiles } from "../context/FileContext";
import { fileService } from "../services/api";

const ShareModal = () => {
  const { modalState, closeModal } = useFiles();
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isOpen = modalState.isOpen && modalState.type === "share";
  const file = modalState.data;

  useEffect(() => {
    if (!isOpen || !file) {
      setShareUrl("");
      setCopied(false);
      setError("");
      return;
    }

    const fetchShareLink = async () => {
      setIsLoading(true);
      setError("");
      setCopied(false);

      try {
        const objectName = file.objectName || file.name;
        const link = await fileService.generateShareLink(objectName);
        setShareUrl(typeof link === "string" ? link : link?.url || "");
      } catch (err) {
        console.error("Failed to generate share link:", err);
        setError("Could not generate share link. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShareLink();
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/15 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 flex items-center justify-center shadow-inner">
            <Share2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight font-['Hanken_Grotesk']">
              Share File
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[260px]" title={file.name}>
              {file.name}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        {isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs font-medium text-gray-400">Generating secure public share link...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
              {error}
            </div>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs text-white font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Share Link Input Box */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                Public Shareable Link
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-[#0b0c16]/80 border border-white/15 rounded-xl py-2.5 pl-3 pr-3 text-xs text-blue-300 font-mono focus:outline-none select-all truncate"
                    onClick={(e) => e.target.select()}
                  />
                </div>

                <button
                  onClick={handleCopy}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    copied
                      ? "bg-emerald-500 text-white shadow-emerald-500/25"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Badge */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5 text-left">
              <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Anyone with this link can view file metadata and download this file directly without needing to log in.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in new tab</span>
              </a>

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
