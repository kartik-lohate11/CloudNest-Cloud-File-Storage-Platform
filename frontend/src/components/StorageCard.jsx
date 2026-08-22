import { Image, Video, FileText, Folder } from "lucide-react";

const StorageCard = ({
  title = "Files",
  items = "0 Items",
  used = "0 GB",
  total = "120 GB",
  type = "image",
  percent = 15,
  onClick,
}) => {
  // Theme configurations for icons, colors, and progress gradients
  const themeConfig = {
    image: {
      icon: Image,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/20",
      borderBg: "border-orange-500/30",
      hoverGradient: "from-orange-500/10",
      progressGradient: "from-orange-500 to-red-500",
      shadow: "shadow-[0_0_10px_rgba(234,88,12,0.8)]",
    },
    video: {
      icon: Video,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
      borderBg: "border-emerald-500/30",
      hoverGradient: "from-emerald-500/10",
      progressGradient: "from-emerald-400 to-teal-500",
      shadow: "shadow-[0_0_10px_rgba(16,185,129,0.8)]",
    },
    document: {
      icon: FileText,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
      borderBg: "border-amber-500/30",
      hoverGradient: "from-amber-500/10",
      progressGradient: "from-amber-400 to-orange-500",
      shadow: "shadow-[0_0_10px_rgba(217,119,6,0.8)]",
    },
    other: {
      icon: Folder,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
      borderBg: "border-blue-500/30",
      hoverGradient: "from-blue-500/10",
      progressGradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-[0_0_10px_rgba(59,130,246,0.8)]",
    },
  };

  const currentTheme = themeConfig[type] || themeConfig.other;
  const IconComponent = currentTheme.icon;

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-5 flex flex-col relative overflow-hidden group glass-card-hover cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      {/* Dynamic Hover Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Header Info */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl ${currentTheme.iconBg} border ${currentTheme.borderBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}
          >
            <IconComponent className={`w-5 h-5 ${currentTheme.iconColor}`} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm tracking-tight font-['Hanken_Grotesk']">
              {title}
            </h4>
            <p className="text-gray-400 text-xs mt-0.5">{items}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar & Details */}
      <div className="mt-auto relative z-10">
        <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
          <span>
            <strong className="text-white font-semibold text-sm">{used}</strong> of {total}
          </span>
          <span className="text-[11px] text-gray-500">{Math.round(percent)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full bg-gradient-to-r ${currentTheme.progressGradient} rounded-full transition-all duration-500 ${currentTheme.shadow}`}
            style={{ width: `${Math.min(Math.max(percent, 5), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StorageCard;
