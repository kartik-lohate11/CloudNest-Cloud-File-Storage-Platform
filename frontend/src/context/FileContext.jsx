import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { INITIAL_FILES, INITIAL_NOTES, fileService, noteService } from "../services/api";

const FileContext = createContext(null);

const sanitizeLegacyStorage = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    // Filter out legacy static mock items stored from previous runs
    return parsed.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const id = String(item.id || "");
      const name = String(item.name || "");
      if (id.startsWith("f-") || id.startsWith("trash-") || id.startsWith("arch-") || id.startsWith("n-")) return false;
      if (name.includes("holiday") || name.includes("bulkAssignment") || name.includes("sem-report") || name.includes("prototype-vid")) return false;
      return true;
    });
  } catch {
    return [];
  }
};

export const FileProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("cloudnest_user");
      return savedUser ? JSON.parse(savedUser) : { name: "Kartik Lohate", email: "kartiklohate8@gmail.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "Cloud Administrator", plan: "Pro 100 GB Plan" };
    } catch {
      return { name: "Kartik Lohate", email: "kartiklohate8@gmail.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "Cloud Administrator", plan: "Pro 100 GB Plan" };
    }
  });

  // Files State - Clean initial states, purged of any cached legacy static mock items
  const [files, setFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState(() => sanitizeLegacyStorage("cloudnest_trash"));
  const [archiveFiles, setArchiveFiles] = useState(() => sanitizeLegacyStorage("cloudnest_archive"));
  const [notes, setNotes] = useState([]);

  // Navigation, Pagination & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pagination States (20 records per page)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);
  const [totalStorageUsedBytes, setTotalStorageUsedBytes] = useState(0);
  const [backendCategoryStats, setBackendCategoryStats] = useState(null);

  // Notes Pagination States
  const [notesCurrentPage, setNotesCurrentPage] = useState(0);
  const [notesTotalPages, setNotesTotalPages] = useState(0);
  const [notesTotalElements, setNotesTotalElements] = useState(0);
  const [notesPageSize] = useState(20);

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

  // 100% Dynamic Storage Calculation based strictly on ALL active user files in database & 5 GB Limit
  const storageStats = useMemo(() => {
    const TOTAL_STORAGE_GB = 5; // 5 GB limit per user

    const categories = {
      image: { count: 0, bytes: 0 },
      video: { count: 0, bytes: 0 },
      document: { count: 0, bytes: 0 },
      other: { count: 0, bytes: 0 },
    };

    const hasBackendStats =
      backendCategoryStats &&
      (backendCategoryStats.image?.count > 0 ||
        backendCategoryStats.video?.count > 0 ||
        backendCategoryStats.document?.count > 0 ||
        backendCategoryStats.other?.count > 0);

    if (hasBackendStats) {
      categories.image.count = backendCategoryStats.image.count || 0;
      categories.image.bytes = backendCategoryStats.image.bytes || 0;
      categories.video.count = backendCategoryStats.video.count || 0;
      categories.video.bytes = backendCategoryStats.video.bytes || 0;
      categories.document.count = backendCategoryStats.document.count || 0;
      categories.document.bytes = backendCategoryStats.document.bytes || 0;
      categories.other.count = backendCategoryStats.other.count || 0;
      categories.other.bytes = backendCategoryStats.other.bytes || 0;
    } else {
      (files || []).forEach((f) => {
        const bytes = f.sizeBytes || 0;
        if (f.type === "image") {
          categories.image.count += 1;
          categories.image.bytes += bytes;
        } else if (f.type === "video") {
          categories.video.count += 1;
          categories.video.bytes += bytes;
        } else if (f.type === "document" || f.type === "pdf") {
          categories.document.count += 1;
          categories.document.bytes += bytes;
        } else {
          categories.other.count += 1;
          categories.other.bytes += bytes;
        }
      });
    }

    const formatGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);
    const formatSize = (bytes) => {
      if (!bytes || bytes === 0) return "0 KB";
      if (bytes >= 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
      if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
      return `${(bytes / 1024).toFixed(2)} KB`;
    };

    const calcPercent = (bytes) => {
      const usedGB = bytes / (1024 * 1024 * 1024);
      return Math.min(Number(((usedGB / TOTAL_STORAGE_GB) * 100).toFixed(1)), 100);
    };

    const overallUsedBytes =
      totalStorageUsedBytes ||
      categories.image.bytes +
        categories.video.bytes +
        categories.document.bytes +
        categories.other.bytes;

    const overallUsedGB = formatGB(overallUsedBytes);
    const overallPercent = calcPercent(overallUsedBytes);
    const maxBytes = 5 * 1024 * 1024 * 1024;
    const remainingBytes = Math.max(0, maxBytes - overallUsedBytes);

    return {
      image: {
        count: categories.image.count,
        usedGB: formatGB(categories.image.bytes),
        usedFormatted: formatSize(categories.image.bytes),
        totalGB: TOTAL_STORAGE_GB,
        percent: calcPercent(categories.image.bytes),
      },
      video: {
        count: categories.video.count,
        usedGB: formatGB(categories.video.bytes),
        usedFormatted: formatSize(categories.video.bytes),
        totalGB: TOTAL_STORAGE_GB,
        percent: calcPercent(categories.video.bytes),
      },
      document: {
        count: categories.document.count,
        usedGB: formatGB(categories.document.bytes),
        usedFormatted: formatSize(categories.document.bytes),
        totalGB: TOTAL_STORAGE_GB,
        percent: calcPercent(categories.document.bytes),
      },
      other: {
        count: categories.other.count,
        usedGB: formatGB(categories.other.bytes),
        usedFormatted: formatSize(categories.other.bytes),
        totalGB: TOTAL_STORAGE_GB,
        percent: calcPercent(categories.other.bytes),
      },
      overall: {
        totalElements: totalElements || files.length,
        usedBytes: overallUsedBytes,
        usedGB: overallUsedGB,
        usedFormatted: formatSize(overallUsedBytes),
        totalGB: TOTAL_STORAGE_GB,
        percent: overallPercent,
        remainingBytes,
        maxBytes,
      },
    };
  }, [files, totalElements, totalStorageUsedBytes, backendCategoryStats]);

  // Fetch user files from backend REST API with pagination
  const fetchUserFiles = async (page = 0) => {
    if (user && user.name) {
      const res = await fileService.getUserFiles(user.name, page, pageSize);
      if (res) {
        setFiles(res.files);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        setTotalStorageUsedBytes(res.totalStorageUsedBytes);
        if (res.categoryStats) {
          setBackendCategoryStats(res.categoryStats);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserFiles(0);
  }, [user?.name]);

  // Modal actions
  const openModal = (type, data = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  // Dynamic File Operations with Spring Boot & MinIO
  const uploadFiles = async (newFileList) => {
    for (const item of newFileList) {
      await fileService.uploadFile(item, user?.name || "User");
    }
    await fetchUserFiles(0);
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

  const permanentlyDelete = async (fileId) => {
    const fileToDelete = trashFiles.find((f) => f.id === fileId);
    if (fileToDelete) {
      const identifier = fileToDelete.objectName || fileToDelete.name;
      await fileService.deleteFile(identifier);
      setTrashFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const emptyTrash = async () => {
    for (const fileToDelete of trashFiles) {
      const identifier = fileToDelete.objectName || fileToDelete.name;
      await fileService.deleteFile(identifier);
    }
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

  const renameFile = async (fileId, newName) => {
    const fileToRename = files.find((f) => f.id === fileId);
    if (fileToRename) {
      const identifier = fileToRename.objectName || fileToRename.name;
      const result = await fileService.renameFile(identifier, newName);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, name: newName, updated: "Just now" } : f))
      );
    }
    closeModal();
  };

  const downloadFile = async (file) => {
    const identifier = file.objectName || file.name;
    await fileService.downloadFile(identifier, file.name);
  };

  // Fetch user notes from backend REST API with pagination and category filter
  const fetchUserNotes = async (page = 0, category = "all") => {
    if (user && user.name) {
      const res = await noteService.getUserNotes(user.name, page, notesPageSize, category);
      if (res) {
        setNotes(res.notes);
        setNotesCurrentPage(res.currentPage);
        setNotesTotalPages(res.totalPages);
        setNotesTotalElements(res.totalElements);
      }
    }
  };

  // Notes Operations with Spring Boot REST API
  const addNote = async (newNote) => {
    await noteService.saveNote(newNote, user?.name || "User");
    await fetchUserNotes(0, newNote.category || "all");
  };

  const updateNote = async (id, updatedData) => {
    await noteService.updateNote(id, updatedData, user?.name || "User");
    await fetchUserNotes(notesCurrentPage);
  };

  const deleteNote = async (id) => {
    await noteService.deleteNote(id);
    await fetchUserNotes(notesCurrentPage);
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
        notesCurrentPage,
        notesTotalPages,
        notesTotalElements,
        notesPageSize,
        fetchUserNotes,
        storageStats,
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        fetchUserFiles,
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
