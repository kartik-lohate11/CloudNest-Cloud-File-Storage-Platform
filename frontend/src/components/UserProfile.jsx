import { useNavigate } from "react-router-dom";
import { X, LogOut, Settings, ShieldCheck, HardDrive, Mail } from "lucide-react";
import { useFiles } from "../context/FileContext";

const UserProfile = () => {
  const { modalState, closeModal, user } = useFiles();
  const navigate = useNavigate();

  if (!modalState.isOpen || modalState.type !== "userProfile") return null;

  const handleLogout = () => {
    localStorage.removeItem("cloudnest_token");
    closeModal();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    closeModal();
    navigate("/settings");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0b0c16] flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* User Info */}
        <h3 className="text-lg font-bold text-white font-['Hanken_Grotesk']">
          {user.name}
        </h3>
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-1">
          <Mail className="w-3.5 h-3.5 text-blue-400" />
          <span>{user.email}</span>
        </p>
        <div className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          {user.plan}
        </div>

        {/* Mini Storage Indicator */}
        <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              Cloud Quota
            </span>
            <span className="text-white font-semibold">80 GB / 120 GB</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[66%]" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Account Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
