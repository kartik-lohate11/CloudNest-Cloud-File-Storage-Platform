import { NavLink, useLocation } from "react-router-dom";
import {
  Cloud,
  Home,
  Laptop,
  FileText,
  Archive,
  Trash2,
  HelpCircle,
  Settings,
  Plus,
  X,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const Sidebar = () => {
  const location = useLocation();
  const {
    sidebarOpen,
    setSidebarOpen,
    selectedFolder,
    setSelectedFolder,
    trashFiles,
    archiveFiles,
  } = useFiles();

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Computer", path: "/files", icon: Laptop },
    { name: "Notes", path: "/notes", icon: FileText },
    { name: "Archive", path: "/archive", icon: Archive, badge: archiveFiles.length },
    { name: "Trash", path: "/trash", icon: Trash2, badge: trashFiles.length },
  ];

  const personalCollections = [
    { name: "School Collections", color: "#10B981", folder: "school" },
    { name: "Personal Collections", color: "#F59E0B", folder: "personal" },
  ];

  const workspaceCollections = [
    { name: "Telkom Collections", color: "#EF4444", folder: "telkom" },
    { name: "Unicorn Collections", color: "#8B5CF6", folder: "unicorn" },
    { name: "Tokopedia Collections", color: "#10B981", folder: "tokopedia" },
  ];

  const handleCollectionClick = (folderKey) => {
    setSelectedFolder(selectedFolder === folderKey ? "all" : folderKey);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 glass-card border-r border-white/10 flex flex-col p-4 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-2 py-4 mb-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-sm border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <Cloud className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
                CloudNest
              </h1>
            </div>
          </NavLink>

          {/* Mobile Close Button */}
          <button
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6 sidebar-scroll">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 group active:translate-x-1 ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-sm border border-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300 border border-white/10">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Personal File Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Personal File
              </span>
              <button
                title="Add Collection"
                className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                onClick={() => handleCollectionClick("personal")}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {personalCollections.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleCollectionClick(item.folder)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left group ${
                    selectedFolder === item.folder
                      ? "bg-white/10 text-white font-medium border border-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}80`,
                    }}
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workspace File Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Workspace File
              </span>
              <button
                title="Add Workspace Collection"
                className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                onClick={() => handleCollectionClick("workspace")}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {workspaceCollections.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleCollectionClick(item.folder)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left group ${
                    selectedFolder === item.folder
                      ? "bg-white/10 text-white font-medium border border-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}80`,
                    }}
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-white/10 mt-auto space-y-1">
          <NavLink
            to="/help"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span>Help Center</span>
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
