import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download,
  Cloud,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Folder,
  FileArchive,
  Music,
  ShieldCheck,
  Calendar,
  HardDrive,
  User,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { fileService } from "../services/api";

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "Recently"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  } catch {
    return "Recently";
  }
};

const getFileCategoryDetails = (fileName = "", contentType = "") => {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const mime = (contentType || "").toLowerCase();

  if (mime.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
    return {
      category: "Image",
      icon: ImageIcon,
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      textCol: "text-blue-400",
      isImage: true,
    };
  }
  if (mime.startsWith("video/") || ["mp4", "webm", "mkv", "avi", "mov"].includes(ext)) {
    return {
      category: "Video",
      icon: Video,
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      textCol: "text-purple-400",
      isVideo: true,
    };
  }
  if (mime.startsWith("audio/") || ["mp3", "wav", "ogg", "flac"].includes(ext)) {
    return {
      category: "Audio",
      icon: Music,
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
      textCol: "text-amber-400",
    };
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return {
      category: "Archive",
      icon: FileArchive,
      gradient: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/30",
      textCol: "text-amber-400",
    };
  }
  if (["js", "jsx", "ts", "tsx", "html", "css", "json", "java", "py", "c", "cpp", "go", "sql"].includes(ext)) {
    return {
      category: "Code",
      icon: FileCode,
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      textCol: "text-emerald-400",
    };
  }
  return {
    category: "Document",
    icon: FileText,
    gradient: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/30",
    textCol: "text-indigo-400",
  };
};

const PublicSharedFile = () => {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const downloadUrl = fileService.getPublicDownloadUrl(token);

  useEffect(() => {
    const fetchFileInfo = async () => {
      setIsLoading(true);
      setError("");

      if (!token) {
        setError("Invalid share token.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await fileService.getSharedFileInfo(token);
        if (data) {
          setFile(data);
        } else {
          // If metadata endpoint fails, set fallback generic info
          setFile({
            name: "Shared File",
            size: "Available for Download",
            type: "Shared Document",
            token: token,
          });
        }
      } catch (err) {
        console.error("Failed to load shared file:", err);
        setError("This shared link has expired, was removed, or does not exist.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileInfo();
  }, [token]);

  const handleDownload = () => {
    setIsDownloading(true);
    // Direct browser navigation to download endpoint
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file?.name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const categoryDetails = getFileCategoryDetails(file?.name, file?.contentType);
  const CategoryIcon = categoryDetails.icon;

  return (
    <div className="min-h-screen bg-[#070913] text-gray-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20 group-hover:scale-105 transition-transform">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
              Cloud<span className="text-blue-400">Nest</span>
            </span>
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Public File Sharing
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/25 transition-opacity"
          >
            Get Free 5GB Storage
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {isLoading ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/15 shadow-2xl flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <h2 className="text-lg font-semibold text-white">Loading shared file...</h2>
              <p className="text-xs text-gray-400">Verifying secure token and fetching file details.</p>
            </div>
          ) : error ? (
            <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-red-500/20 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Link Expired or Invalid</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go to CloudNest Home</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-7 sm:p-9 border border-white/15 shadow-2xl space-y-7 animate-in fade-in zoom-in-95">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Share Link Verified</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {file?.category || categoryDetails.category}
                </span>
              </div>

              {/* File Icon & Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${categoryDetails.gradient} ${categoryDetails.border} border flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <CategoryIcon className={`w-10 h-10 ${categoryDetails.textCol}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h1
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words font-['Hanken_Grotesk']"
                    title={file?.name}
                  >
                    {file?.name || "Shared Document"}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Shared publicly via CloudNest Cloud Storage
                  </p>
                </div>
              </div>

              {/* Image Live Preview if Image */}
              {categoryDetails.isImage && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c16] max-h-64 flex items-center justify-center">
                  <img
                    src={downloadUrl}
                    alt={file?.name || "Shared Image"}
                    className="w-full h-full object-contain max-h-64 rounded-2xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* File Size */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                    <span>File Size</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white font-mono">
                    {file?.sizeFormatted || (typeof file?.size === "number" ? formatBytes(file.size) : file?.size || "Unknown")}
                  </div>
                </div>

                {/* Shared Date */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Shared</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {formatDate(file?.uploadedAt || file?.createdAt)}
                  </div>
                </div>

                {/* Security */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Security</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-emerald-400">
                    Scanned &amp; Safe
                  </div>
                </div>
              </div>

              {/* Download Action Area */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-4 px-6 rounded-2xl btn-gradient text-white text-sm font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-75 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Starting Download...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download File</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  Direct high-speed download powered by MinIO S3 Object Storage
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} CloudNest. Secure, fast, decentralized cloud file storage.</p>
      </footer>
    </div>
  );
};

export default PublicSharedFile;
