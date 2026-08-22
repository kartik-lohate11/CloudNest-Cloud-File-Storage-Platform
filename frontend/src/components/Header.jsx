import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  Bell,
  UploadCloud,
  Menu,
} from "lucide-react";
import { useFiles } from "../context/FileContext";

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
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January 2024");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const months = [
    "January 2024",
    "December 2023",
    "November 2023",
    "October 2023",
    "September 2023",
  ];

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
        {/* Date Filter Dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => {
              setShowDateMenu(!showDateMenu);
              setShowSortMenu(false);
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors px-3.5 py-2 rounded-xl hover:bg-white/5 border border-white/5"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showDateMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-1.5 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowDateMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedMonth === m
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Options Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowDateMenu(false);
            }}
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

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0b0c16]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-white/15 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-semibold text-sm text-white">Notifications</h4>
                <span className="text-xs text-blue-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">Storage alert: 65% used</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      Your cloud quota is running smoothly with 80 GB free.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">File sync complete</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      10 files synchronized to Telkom Collections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => openModal("userProfile", user)}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 hover:border-blue-500 transition-all shadow-[0_0_12px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Account Profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
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
