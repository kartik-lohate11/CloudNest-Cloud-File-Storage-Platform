import { useState } from "react";
import {
  User,
  Shield,
  HardDrive,
  Bell,
  Key,
  Server,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Settings = () => {
  const { user, setUser } = useFiles();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  // Backend config fields (Spring Boot & MinIO)
  const [backendUrl, setBackendUrl] = useState("http://localhost:8081");
  const [minioBucket, setMinioBucket] = useState("cloudnest-user-storage");

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifyStorage, setNotifyStorage] = useState(true);
  const [notifyShared, setNotifyShared] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      role,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const tabs = [
    { id: "profile", label: "Profile & Identity", icon: User },
    { id: "account", label: "Account & Plan", icon: HardDrive },
    { id: "security", label: "Security & Keys", icon: Shield },
    { id: "backend", label: "Spring Boot & MinIO", icon: Server },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen flex relative overflow-x-hidden">
      <div className="abstract-bg" />
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full relative z-10">
        <Header />

        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
              CloudNest Preferences & Configuration
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage your personal cloud profile, security safeguards, and backend endpoints.
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/10">
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">
                  Personal Information
                </h3>

                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Role / Department
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account & Plan Tab */}
            {activeTab === "account" && (
              <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/10">
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">
                  Storage Subscription & Quota
                </h3>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase">Current Tier</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{user.plan}</h4>
                    <p className="text-xs text-gray-400 mt-1">120 GB total storage capacity</p>
                  </div>
                  <button
                    type="button"
                    className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md"
                  >
                    Upgrade Plan
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Used Space: 80 GB</span>
                    <span className="text-white font-medium">Free: 40 GB</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[66%]" />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/10">
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">
                  Security & Authentication
                </h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Require an authenticator app token when logging in.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Password</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Last updated 3 months ago</p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Spring Boot & MinIO Tab */}
            {activeTab === "backend" && (
              <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/10">
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">
                  Backend Integration Configuration (Spring Boot & MinIO)
                </h3>
                <p className="text-xs text-gray-400">
                  The frontend service layer in <code className="text-blue-300">src/services/api.js</code> is pre-wired to communicate with these endpoints.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Spring Boot REST API Base URL
                    </label>
                    <input
                      type="text"
                      value={backendUrl}
                      onChange={(e) => setBackendUrl(e.target.value)}
                      className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      MinIO S3 Bucket Target
                    </label>
                    <input
                      type="text"
                      value={minioBucket}
                      onChange={(e) => setMinioBucket(e.target.value)}
                      className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10">
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">
                  Email & App Notifications
                </h3>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Storage Quota Alerts</h4>
                    <p className="text-xs text-gray-400">Notify me when quota reaches 85%</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyStorage}
                    onChange={(e) => setNotifyStorage(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Workspace Activity</h4>
                    <p className="text-xs text-gray-400">Notify me when team members upload files</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyShared}
                    onChange={(e) => setNotifyShared(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Settings;
