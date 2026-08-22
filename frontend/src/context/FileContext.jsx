import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { INITIAL_FILES, INITIAL_NOTES } from "../services/api";

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cloudnest_user");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Kartik Lohate",
          email: "kartiklohate8@gmail.com",
          role: "Pro Administrator",
          plan: "Pro 120 GB Plan",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };
  });

  // Files State
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem("cloudnest_files");
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [trashFiles, setTrashFiles] = useState(() => {
    const saved = localStorage.getItem("cloudnest_trash");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "trash-1",
            name: "old-draft-specs.docx",
            type: "document",
            extension: "docx",
            size: "420.5 KB",
            sizeBytes: 430592,
            uploadDate: "12 Dec 2023",
            deletedDate: "14 Jan 2024",
            location: "/Personal File/Personal Collections",
            owner: "Kartik Lohate",
          },
        ];
  });

  const [archiveFiles, setArchiveFiles] = useState(() => {
    const saved = localStorage.getItem("cloudnest_archive");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "arch-1",
            name: "annual-tax-report-2022.pdf",
            type: "pdf",
            extension: "pdf",
            size: "8.4 MB",
            sizeBytes: 8808038,
            uploadDate: "15 Jan 2023",
            archivedDate: "02 Jan 2024",
            location: "/Workspace File/Telkom Collections",
            owner: "Kartik Lohate",
          },
        ];
  });

  // Notes State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("cloudnest_notes");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  // Navigation & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'details' | 'upload' | 'delete' | 'rename' | 'userProfile'
    data: null,
  });

  // Persist State to localStorage
  useEffect(() => {
    localStorage.setItem("cloudnest_files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem("cloudnest_trash", JSON.stringify(trashFiles));
  }, [trashFiles]);

  useEffect(() => {
    localStorage.setItem("cloudnest_archive", JSON.stringify(archiveFiles));
  }, [archiveFiles]);

  useEffect(() => {
    localStorage.setItem("cloudnest_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("cloudnest_user", JSON.stringify(user));
  }, [user]);

  // Dynamic Storage Calculation
  const storageStats = useMemo(() => {
    const stats = {
      image: { count: 1768, usedGB: 20, totalGB: 120, percent: 16.6 },
      video: { count: 223, usedGB: 10, totalGB: 120, percent: 8.3 },
      document: { count: 1522, usedGB: 15, totalGB: 120, percent: 12.5 },
      other: { count: 1034, usedGB: 35, totalGB: 120, percent: 29.1 },
    };

    // Calculate extra uploaded files
    files.forEach((f) => {
      if (f.type === "image") stats.image.count += 1;
      else if (f.type === "video") stats.video.count += 1;
      else if (f.type === "document" || f.type === "pdf") stats.document.count += 1;
      else stats.other.count += 1;
    });

    return stats;
  }, [files]);

  // Modal actions
  const openModal = (type, data = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  // File Operations
  const uploadFiles = (newFileList, targetLocation = "/Personal File/Personal Collections") => {
    const formattedFiles = newFileList.map((item, idx) => {
      const ext = item.name.split(".").pop().toLowerCase();
      let type = "other";
      if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) type = "image";
      else if (["mp4", "mov", "mkv", "avi", "webm"].includes(ext)) type = "video";
      else if (["pdf"].includes(ext)) type = "pdf";
      else if (["doc", "docx", "txt", "xlsx", "xls", "csv", "ppt", "pptx"].includes(ext)) type = "document";

      const sizeMB = (item.size / (1024 * 1024)).toFixed(2);
      const sizeStr = item.size > 1024 * 1024 * 1024
        ? `${(item.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : item.size > 1024 * 1024
        ? `${sizeMB} MB`
        : `${(item.size / 1024).toFixed(2)} KB`;

      return {
        id: `f-${Date.now()}-${idx}`,
        name: item.name,
        type,
        extension: ext,
        size: sizeStr,
        sizeBytes: item.size,
        uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        updated: "Just now",
        location: targetLocation,
        owner: user.name,
        isQuickAccess: true,
        isArchived: false,
        isTrash: false,
      };
    });

    setFiles((prev) => [...formattedFiles, ...prev]);
    closeModal();
  };

  const deleteFile = (fileId) => {
    const fileToDelete = files.find((f) => f.id === fileId);
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setTrashFiles((prev) => [
        {
          ...fileToDelete,
          deletedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const restoreFromTrash = (fileId) => {
    const fileToRestore = trashFiles.find((f) => f.id === fileId);
    if (fileToRestore) {
      setTrashFiles((prev) => prev.filter((f) => f.id !== fileId));
      setFiles((prev) => [fileToRestore, ...prev]);
    }
  };

  const permanentlyDelete = (fileId) => {
    setTrashFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const emptyTrash = () => {
    setTrashFiles([]);
  };

  const archiveFile = (fileId) => {
    const fileToArchive = files.find((f) => f.id === fileId);
    if (fileToArchive) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setArchiveFiles((prev) => [
        {
          ...fileToArchive,
          archivedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const restoreFromArchive = (fileId) => {
    const fileToRestore = archiveFiles.find((f) => f.id === fileId);
    if (fileToRestore) {
      setArchiveFiles((prev) => prev.filter((f) => f.id !== fileId));
      setFiles((prev) => [fileToRestore, ...prev]);
    }
  };

  const deleteFromArchive = (fileId) => {
    const fileToDelete = archiveFiles.find((f) => f.id === fileId);
    if (fileToDelete) {
      setArchiveFiles((prev) => prev.filter((f) => f.id !== fileId));
      setTrashFiles((prev) => [
        {
          ...fileToDelete,
          deletedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        },
        ...prev,
      ]);
    }
  };

  const renameFile = (fileId, newName) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, name: newName, updated: "Just now" } : f))
    );
    closeModal();
  };

  const downloadFile = (file) => {
    // Generates a mock text/blob download in the browser
    const dummyContent = `CloudNest Storage Service\nFile: ${file.name}\nSize: ${file.size}\nOwner: ${file.owner}\nUploaded: ${file.uploadDate}\n\nContent stored securely on CloudNest.`;
    const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Notes Operations
  const addNote = (newNote) => {
    const note = {
      id: `n-${Date.now()}`,
      title: newNote.title || "Untitled Note",
      content: newNote.content || "",
      category: newNote.category || "Personal",
      tags: newNote.tags || [],
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setNotes((prev) => [note, ...prev]);
  };

  const updateNote = (id, updatedData) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updatedData, date: "Edited just now" } : note))
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <FileContext.Provider
      value={{
        user,
        setUser,
        files,
        trashFiles,
        archiveFiles,
        notes,
        storageStats,
        searchQuery,
        setSearchQuery,
        selectedFolder,
        setSelectedFolder,
        fileTypeFilter,
        setFileTypeFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        sidebarOpen,
        setSidebarOpen,
        modalState,
        openModal,
        closeModal,
        uploadFiles,
        deleteFile,
        restoreFromTrash,
        permanentlyDelete,
        emptyTrash,
        archiveFile,
        restoreFromArchive,
        deleteFromArchive,
        renameFile,
        downloadFile,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};
