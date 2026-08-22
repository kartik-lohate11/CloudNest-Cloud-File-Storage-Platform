import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle, Inbox, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Trash = () => {
  const { trashFiles, restoreFromTrash, permanentlyDelete, emptyTrash } = useFiles();
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen flex relative overflow-x-hidden">
      <div className="abstract-bg" />
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full relative z-10">
        <Header />

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-['Hanken_Grotesk']">
                Trash & Deleted Items
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Items in trash will be permanently purged after 30 days. You can restore or delete them permanently now.
              </p>
            </div>

            {trashFiles.length > 0 && (
              <button
                onClick={() => setConfirmEmpty(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Empty Trash</span>
              </button>
            )}
          </div>

          {/* Warning Banner */}
          {trashFiles.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              <span>
                Restoring a file places it back in your active files list and restores its cloud quota allocation.
              </span>
            </div>
          )}

          {trashFiles.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center flex flex-col items-center justify-center border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Trash is empty</h3>
              <p className="text-gray-400 text-xs max-w-md">
                No files are currently in the recycle bin. Deleted items will be held here.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-400 font-semibold uppercase tracking-wider bg-white/5">
                      <th className="py-4 px-6">Deleted File</th>
                      <th className="py-4 px-6">Date Deleted</th>
                      <th className="py-4 px-6">Original Location</th>
                      <th className="py-4 px-6">File Size</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {trashFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </div>
                          <div>
                            <span className="font-medium text-white block">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              Uploaded {file.uploadDate}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-gray-400 text-xs whitespace-nowrap">
                          {file.deletedDate || "Recently"}
                        </td>

                        <td className="py-4 px-6 text-gray-400 text-xs truncate max-w-xs">
                          {file.location || "/Personal File/Personal Collections"}
                        </td>

                        <td className="py-4 px-6 text-gray-400 text-xs whitespace-nowrap font-medium">
                          {file.size}
                        </td>

                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => restoreFromTrash(file.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>

                            <button
                              onClick={() => permanentlyDelete(file.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Permanently</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation for Emptying Trash */}
      {confirmEmpty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-red-500/30">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-['Hanken_Grotesk']">
              Empty Entire Trash?
            </h3>
            <p className="text-gray-300 text-xs mb-5">
              All {trashFiles.length} items will be permanently erased. This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setConfirmEmpty(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  emptyTrash();
                  setConfirmEmpty(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold shadow-lg"
              >
                Empty Trash Now
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Trash;
