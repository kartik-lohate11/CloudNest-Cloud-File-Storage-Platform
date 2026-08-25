import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  UploadCloud,
  Menu,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

const getInitials = (name) => {
  if (!name) return "CN";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleanName.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return cleanName.substring(0, 2).toUpperCase();
};

const Header = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setSidebarOpen,
    openModal,
    user,
  } = useFiles();

  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { label: "Newest First", value: "date-desc" },
    { label: "Oldest First", value: "date-asc" },
    { label: "File Name (A-Z)", value: "name-asc" },
    { label: "File Name (Z-A)", value: "name-desc" },
    { label: "Size (Largest)", value: "size-desc" },
    { label: "Size (Smallest)", value: "size-asc" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full glass-card border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Hamburger & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-white font-['Hanken_Grotesk']">
          CloudNest
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl relative items-center">
        <Search className="w-5 h-5 absolute left-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for documents & files"
          className="w-full dark-input rounded-full py-2.5 pl-12 pr-12 text-sm text-white placeholder-gray-500 focus:border-blue-500 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-10 text-xs text-gray-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
          >
            Clear
          </button>
        )}
        <button
          title="Filter details"
          onClick={() => openModal("upload")}
          className="absolute right-3.5 text-gray-400 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Sort Options Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors px-3.5 py-2 rounded-xl hover:bg-white/5 border border-white/5"
          >
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
            <span>Sort</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-1.5 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === opt.value
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar with Name Initials */}
        <button
          onClick={() => openModal("userProfile", user)}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 border border-white/20 flex items-center justify-center font-bold text-white text-xs md:text-sm shadow-md hover:scale-105 transition-all active:scale-95 shrink-0 uppercase"
          title={user?.name?.includes("@") ? user.name.split("@")[0] : (user?.name || "Account Profile")}
        >
          {getInitials(user?.name || user?.email || "Kartik Lohate")}
        </button>

        {/* Upload Files Button */}
        <button
          onClick={() => openModal("upload")}
          className="btn-gradient text-white rounded-xl py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-md active:scale-95 border border-transparent shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Files</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
