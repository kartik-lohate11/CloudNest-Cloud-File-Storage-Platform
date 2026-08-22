import { Archive as ArchiveIcon, RotateCcw, Trash2, HardDrive, Inbox } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Archive = () => {
  const { archiveFiles, restoreFromArchive, deleteFromArchive } = useFiles();

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
                Archived Files & Cold Vault
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Archived files are compressed and preserved for long-term historical reference.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <ArchiveIcon className="w-4 h-4 text-purple-400" />
              <span>{archiveFiles.length} files in cold storage</span>
            </div>
          </div>

          {archiveFiles.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center flex flex-col items-center justify-center border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Archive is empty</h3>
              <p className="text-gray-400 text-xs max-w-md">
                Files you archive from the Dashboard or directory will appear here safely.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-400 font-semibold uppercase tracking-wider bg-white/5">
                      <th className="py-4 px-6">Archived File</th>
                      <th className="py-4 px-6">Archived Date</th>
                      <th className="py-4 px-6">Original Location</th>
                      <th className="py-4 px-6">File Size</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {archiveFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <ArchiveIcon className="w-4 h-4 text-purple-400" />
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
                          {file.archivedDate || "Recent"}
                        </td>

                        <td className="py-4 px-6 text-gray-400 text-xs truncate max-w-xs">
                          {file.location}
                        </td>

                        <td className="py-4 px-6 text-gray-400 text-xs whitespace-nowrap font-medium">
                          {file.size}
                        </td>

                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => restoreFromArchive(file.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>

                            <button
                              onClick={() => deleteFromArchive(file.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Archive;
