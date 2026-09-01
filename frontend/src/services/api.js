import axios from "axios";

// Central Backend URL configured via .env
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

// Base API instance prepared for Spring Boot backend
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Auth Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cloudnest_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("cloudnest_token");
      localStorage.removeItem("cloudnest_user");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/oauth/callback") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Dynamic storage state constants
export const INITIAL_FILES = [];
export const INITIAL_NOTES = [];

// Helper to transform Spring Boot FileMetaDataDto into frontend file model
export const transformBackendFile = (backendFile) => {
  if (!backendFile) return null;
  const ext = (backendFile.extension || "").toLowerCase();
  let type = "other";
  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) type = "image";
  else if (["mp4", "mov", "mkv", "avi", "webm"].includes(ext)) type = "video";
  else if (["pdf"].includes(ext)) type = "pdf";
  else if (["doc", "docx", "txt", "xlsx", "xls", "csv", "ppt", "pptx"].includes(ext)) type = "document";

  const sizeBytes = backendFile.size || 0;
  const sizeStr = sizeBytes > 1024 * 1024 * 1024
    ? `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
    : sizeBytes > 1024 * 1024
    ? `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(sizeBytes / 1024).toFixed(2)} KB`;

  return {
    id: backendFile.id ? `db-${backendFile.id}` : backendFile.objectName || `f-${Date.now()}`,
    name: backendFile.originalFileName || backendFile.objectName || "Untitled File",
    objectName: backendFile.objectName,
    type,
    extension: ext,
    size: sizeStr,
    sizeBytes,
    uploadDate: backendFile.createdAt
      ? new Date(backendFile.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "Recently",
    updated: "Recently",
    location: "cloudnest",
    owner: "User",
    isQuickAccess: true,
    isArchived: false,
    isTrash: false,
  };
};

// Service Layer Endpoints Prepared for Backend Integration
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/user/api/login", {
        userName: credentials.userName || credentials.email,
        password: credentials.password,
      });

      const authData = response.data; // Response: { token: "JWT_TOKEN", user: { id, userName, mail } }
      if (!authData) {
        throw new Error("No response data received from server");
      }

      const realToken = authData.token;
      const userObj = authData.user || authData.userDto || {};

      return {
        token: realToken,
        user: {
          id: userObj.id,
          userName: userObj.userName || userObj.name,
          mail: userObj.mail || userObj.email,
          name: userObj.userName || userObj.name || userObj.mail,
          email: userObj.mail || userObj.email,
        },
        userDto: userObj,
        data: authData,
      };
    } catch (error) {
      if (error?.response) throw error;
      throw new Error("Invalid username or password");
    }
  },

  getCurrentUser: async (customToken) => {
    try {
      const token = customToken || localStorage.getItem("cloudnest_token");
      const response = await api.get("/user/api/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      if (error?.response) throw error;
      throw new Error("Failed to fetch user profile");
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post("/user/api/create", {
        userName: userData.userName || userData.name,
        mail: userData.email,
        password: userData.password,
      });

      const data = response.data;
      if (!data) {
        throw new Error("No response data received from server");
      }

      return {
        token: `cloudnest-token-${data.id || Date.now()}`,
        user: {
          id: data.id,
          name: data.userName || data.name,
          email: data.mail || data.email,
          role: "Pro User",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          plan: "Pro 100 GB Plan",
        },
        data: data,
      };
    } catch (error) {
      console.error("Backend API create error:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      return response.data;
    } catch {
      return { success: true, message: "Reset instructions sent to your email" };
    }
  },

  sendOtp: async (email, otpType = "REGISTRATION") => {
    const payload = { mail: email, email: email, otpType: otpType, type: otpType };
    try {
      const response = await api.post("/user/api/send-otp", payload);
      return response.data;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
      try {
        const response2 = await api.post("/auth/send-otp", payload);
        return response2.data;
      } catch (err2) {
        throw err2;
      }
    }
  },

  verifyOtp: async (email, otp, otpType = "REGISTRATION") => {
    const payload = { mail: email, email: email, otp: otp, otpType: otpType, type: otpType };
    try {
      const response = await api.post("/user/api/verify-otp", payload);
      const data = response.data;
      const msg = typeof data === "string" ? data : data?.message || "";
      if (msg && !msg.toLowerCase().includes("verified successfully")) {
        throw new Error(msg);
      }
      return data;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
      throw error;
    }
  },

  updatePassword: async (email, password) => {
    try {
      const response = await api.post("/user/api/update-password", {
        mail: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
      throw new Error("Password update failed. Please try again.");
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.post("/user/api/update-password", {
        mail: data.email,
        password: data.newPassword,
      });
      return response.data;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
      throw new Error("Password update failed. Please try again.");
    }
  },
};

export const fileService = {
  getUserFiles: async (userName, page = 0, size = 20, query = "", fileType = "all", sortBy = "date-desc") => {
    try {
      let url = `/file/api/user/${userName}?page=${page}&size=${size}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (fileType && fileType !== "all") url += `&fileType=${encodeURIComponent(fileType)}`;
      if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;

      const response = await api.get(url);
      const data = response.data || {};
      const rawContent = data.content || (Array.isArray(data) ? data : []);
      const mappedFiles = rawContent.map(transformBackendFile).filter(Boolean);

      return {
        files: mappedFiles,
        currentPage: data.currentPage || 0,
        totalElements: data.totalElements !== undefined ? data.totalElements : mappedFiles.length,
        totalPages: data.totalPages !== undefined ? data.totalPages : 1,
        pageSize: data.pageSize || 20,
        totalStorageUsedBytes: data.totalStorageUsedBytes || 0,
        categoryStats: data.categoryStats || null,
      };
    } catch (error) {
      console.warn("Failed to fetch user files from backend:", error?.message);
      return {
        files: [],
        currentPage: 0,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        totalStorageUsedBytes: 0,
        categoryStats: null,
      };
    }
  },

  searchFiles: async (userName, query = "", page = 0, size = 20, sortBy = "date-desc") => {
    try {
      const response = await api.get(
        `/file/api/search/${userName}?query=${encodeURIComponent(query)}&page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}`
      );
      const data = response.data || {};
      const rawContent = data.content || [];
      const mappedFiles = rawContent.map(transformBackendFile).filter(Boolean);

      return {
        files: mappedFiles,
        currentPage: data.currentPage || 0,
        totalElements: data.totalElements || mappedFiles.length,
        totalPages: data.totalPages || 0,
        pageSize: data.pageSize || 20,
      };
    } catch (error) {
      console.warn("Failed to search user files from backend:", error?.message);
      return { files: [], currentPage: 0, totalElements: 0, totalPages: 0, pageSize: 20 };
    }
  },

  filterFiles: async (userName, fileType = "all", page = 0, size = 20, sortBy = "date-desc") => {
    try {
      const response = await api.get(
        `/file/api/filter/${userName}?fileType=${encodeURIComponent(fileType)}&page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}`
      );
      const data = response.data || {};
      const rawContent = data.content || [];
      const mappedFiles = rawContent.map(transformBackendFile).filter(Boolean);

      return {
        files: mappedFiles,
        currentPage: data.currentPage || 0,
        totalElements: data.totalElements || mappedFiles.length,
        totalPages: data.totalPages || 0,
        pageSize: data.pageSize || 20,
      };
    } catch (error) {
      console.warn("Failed to filter user files from backend:", error?.message);
      return { files: [], currentPage: 0, totalElements: 0, totalPages: 0, pageSize: 20 };
    }
  },

  sortFiles: async (userName, sortBy = "date-desc", page = 0, size = 20) => {
    try {
      const response = await api.get(
        `/file/api/sort/${userName}?sortBy=${encodeURIComponent(sortBy)}&page=${page}&size=${size}`
      );
      const data = response.data || {};
      const rawContent = data.content || [];
      const mappedFiles = rawContent.map(transformBackendFile).filter(Boolean);

      return {
        files: mappedFiles,
        currentPage: data.currentPage || 0,
        totalElements: data.totalElements || mappedFiles.length,
        totalPages: data.totalPages || 0,
        pageSize: data.pageSize || 20,
      };
    } catch (error) {
      console.warn("Failed to sort user files from backend:", error?.message);
      return { files: [], currentPage: 0, totalElements: 0, totalPages: 0, pageSize: 20 };
    }
  },

  uploadFile: async (file, userName) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/file/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          userName: userName,
        },
      });
      return transformBackendFile(response.data);
    } catch (error) {
      console.warn("Failed to upload file to backend:", error?.message);
      return null;
    }
  },

  downloadFile: async (identifier, originalFileName) => {
    try {
      const response = await api.get(`/file/api/download/${identifier}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalFileName || identifier);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.warn("Failed to download file from backend:", error?.message);
      return false;
    }
  },

  deleteFile: async (identifier) => {
    try {
      const response = await api.delete(`/file/api/delete/${identifier}`);
      return response.data;
    } catch (error) {
      console.warn("Failed to delete file on backend:", error?.message);
      return null;
    }
  },

  renameFile: async (identifier, newName) => {
    try {
      const response = await api.put(`/file/api/rename/${identifier}?newName=${encodeURIComponent(newName)}`);
      return transformBackendFile(response.data);
    } catch (error) {
      console.warn("Failed to rename file on backend:", error?.message);
      return null;
    }
  },

  generateShareLink: async (objectName) => {
    try {
      const response = await api.post(`/file/api/${encodeURIComponent(objectName)}/share`);
      return response.data;
    } catch (error) {
      if (error?.response) throw error;
      throw new Error("Failed to generate share link");
    }
  },

  getSharedFileInfo: async (token) => {
    try {
      const response = await api.get(`/file/api/public/file/${token}/info`);
      return transformBackendFile(response.data);
    } catch {
      return null;
    }
  },

  getPublicDownloadUrl: (token) => {
    return `${BACKEND_URL}/file/api/public/file/${token}`;
  },
};

export const noteService = {
  getUserNotes: async (userName, page = 0, size = 20, category = "all") => {
    try {
      const catParam = category && category !== "all" ? `&category=${encodeURIComponent(category)}` : "";
      const response = await api.get(`/file/api/notes/user/${userName}?page=${page}&size=${size}${catParam}`);
      const data = response.data || {};
      return {
        notes: data.content || [],
        currentPage: data.currentPage || 0,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        pageSize: data.pageSize || 20,
      };
    } catch (error) {
      console.warn("Failed to fetch notes from backend:", error?.message);
      return { notes: [], currentPage: 0, totalElements: 0, totalPages: 0, pageSize: 20 };
    }
  },

  saveNote: async (noteData, userName) => {
    try {
      const response = await api.post("/file/api/notes", noteData, {
        headers: { userName: userName || "User" },
      });
      return response.data;
    } catch (error) {
      console.warn("Failed to save note on backend:", error?.message);
      return null;
    }
  },

  updateNote: async (id, noteData, userName) => {
    try {
      const response = await api.put(`/file/api/notes/${id}`, noteData, {
        headers: { userName: userName || "User" },
      });
      return response.data;
    } catch (error) {
      console.warn("Failed to update note on backend:", error?.message);
      return null;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/file/api/notes/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Failed to delete note on backend:", error?.message);
      return null;
    }
  },
};

export default api;
