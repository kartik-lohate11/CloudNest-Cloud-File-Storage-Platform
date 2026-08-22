import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Tag, Calendar, Sparkles, X, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";
import { useFiles } from "../context/FileContext";

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useFiles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Workspace");
  const [tagInput, setTagInput] = useState("");

  const handleStartCreate = () => {
    setTitle("");
    setContent("");
    setCategory("Workspace");
    setTagInput("");
    setEditingNoteId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTagInput(note.tags ? note.tags.join(", ") : "");
    setEditingNoteId(note.id);
    setIsCreating(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tagsArray = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: title.trim() || "Untitled Note",
        content,
        category,
        tags: tagsArray,
      });
    } else {
      addNote({
        title: title.trim() || "Untitled Note",
        content,
        category,
        tags: tagsArray,
      });
    }

    setIsCreating(false);
    setEditingNoteId(null);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      n.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
                Cloud Notes & Quick Scratchpads
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Keep quick documentation, project outlines, and research notes securely synced.
              </p>
            </div>

            <button
              onClick={handleStartCreate}
              className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Note</span>
            </button>
          </div>

          {/* Search & Category Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {["all", "Workspace", "School", "Personal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                      : "glass-card text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes content..."
                className="w-full dark-input rounded-xl py-2 pl-10 pr-4 text-xs text-white"
              />
            </div>
          </div>

          {/* Notes Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/10 glass-card-hover group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        note.category === "Workspace"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : note.category === "School"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1 text-gray-400 hover:text-amber-400 transition-colors"
                        title="Edit Note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white text-base mb-2 font-['Hanken_Grotesk'] leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {note.content}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{note.date}</span>
                  </div>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 truncate max-w-[120px]">
                        {note.tags.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-60" />
              <p className="text-white font-medium text-sm">No notes found</p>
              <p className="text-xs mt-1">Create your first note to start organizing ideas.</p>
            </div>
          )}
        </div>
      </main>

      {/* Note Creation / Editing Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveNote}
            className="glass-card w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 relative"
          >
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 font-['Hanken_Grotesk']">
              {editingNoteId ? "Edit Note" : "Create New Note"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full dark-input rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full dark-input rounded-xl py-2.5 px-3 text-xs text-white appearance-none cursor-pointer"
                  >
                    <option value="Workspace" className="bg-[#121320] text-white">
                      Workspace
                    </option>
                    <option value="School" className="bg-[#121320] text-white">
                      School
                    </option>
                    <option value="Personal" className="bg-[#121320] text-white">
                      Personal
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. backend, draft"
                    className="w-full dark-input rounded-xl py-2.5 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Content
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note markdown or text content here..."
                  className="w-full dark-input rounded-xl py-2.5 px-4 text-xs text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-5">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg"
              >
                {editingNoteId ? "Update Note" : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      )}

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default Notes;
