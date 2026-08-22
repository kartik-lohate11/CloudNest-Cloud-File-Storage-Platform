import axios from "axios";

// Base API instance prepared for Spring Boot backend
const api = axios.create({
  baseURL: "http://localhost:8081",
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

// Initial Mock Files Data based on design specifications
export const INITIAL_FILES = [
  {
    id: "f-1",
    name: "holiday-01.jpeg",
    type: "image",
    extension: "jpeg",
    size: "11.56 MB",
    sizeBytes: 12121538,
    uploadDate: "12 Jan 2024",
    updated: "3 days ago",
    location: "/Personal File/School Collections",
    owner: "Kartik Lohate",
    isQuickAccess: true,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-2",
    name: "sem-report.docx",
    type: "document",
    extension: "docx",
    size: "111.56 KB",
    sizeBytes: 114237,
    uploadDate: "10 Jan 2024",
    updated: "5 days ago",
    location: "/Personal File/Personal Collections",
    owner: "Kartik Lohate",
    isQuickAccess: true,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-3",
    name: "prototype-vid.mp4",
    type: "video",
    extension: "mp4",
    size: "1.56 GB",
    sizeBytes: 1675037245,
    uploadDate: "05 Jan 2024",
    updated: "1 week ago",
    location: "/Workspace File/Unicorn Collections",
    owner: "Kartik Lohate",
    isQuickAccess: true,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-4",
    name: "supersemaret.pdf",
    type: "pdf",
    extension: "pdf",
    size: "112.56 MB",
    sizeBytes: 118029516,
    uploadDate: "02 Jan 2024",
    updated: "2 weeks ago",
    location: "/Workspace File/Telkom Collections",
    owner: "Kartik Lohate",
    isQuickAccess: true,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-5",
    name: "good-memories.png",
    type: "image",
    extension: "png",
    size: "15.7 MB",
    sizeBytes: 16462643,
    uploadDate: "17 Aug 2023",
    updated: "2 Month ago",
    location: "/Personal File/Personal Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-6",
    name: "data-webtech.pdf",
    type: "pdf",
    extension: "pdf",
    size: "17.5 MB",
    sizeBytes: 18350080,
    uploadDate: "30 Aug 2023",
    updated: "1 Month ago",
    location: "/Workspace File/Telkom Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-7",
    name: "live-report.docx",
    type: "document",
    extension: "docx",
    size: "34.7 MB",
    sizeBytes: 36385587,
    uploadDate: "31 Aug 2023",
    updated: "1 Month ago",
    location: "/Workspace File/Tokopedia Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-8",
    name: "valorant.apk",
    type: "other",
    extension: "apk",
    size: "105.7 MB",
    sizeBytes: 110834483,
    uploadDate: "10 Sept 2023",
    updated: "4 Week ago",
    location: "/Personal File/School Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-9",
    name: "old-memories.mov",
    type: "video",
    extension: "mov",
    size: "505.7 MB",
    sizeBytes: 530264883,
    uploadDate: "17 Sept 2023",
    updated: "3 Week ago",
    location: "/Personal File/Personal Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
  {
    id: "f-10",
    name: "good-girl.jpeg",
    type: "image",
    extension: "jpeg",
    size: "100.8 MB",
    sizeBytes: 105696460,
    uploadDate: "24 Sept 2023",
    updated: "2 Week ago",
    location: "/Workspace File/Unicorn Collections",
    owner: "Kartik Lohate",
    isQuickAccess: false,
    isArchived: false,
    isTrash: false,
  },
];

export const INITIAL_NOTES = [
  {
    id: "n-1",
    title: "Sprint Planning & Cloud Architecture",
    content: "Review MinIO object storage integration, configure multipart uploads for files > 50MB, and verify JWT token refresh cycle on Spring Boot endpoints.",
    category: "Workspace",
    date: "14 Jan 2024",
    tags: ["architecture", "backend"],
  },
  {
    id: "n-2",
    title: "School Research Papers to Review",
    content: "Collect citations on distributed file systems, Raft consensus algorithm, and erasure coding for durable multi-region storage.",
    category: "School",
    date: "10 Jan 2024",
    tags: ["research", "systems"],
  },
  {
    id: "n-3",
    title: "Design System Guidelines",
    content: "Ensure all cards use 16px radius with glassmorphism blur(12px) and glowing borders on hover. Hanken Grotesk for headings, Plus Jakarta Sans for body.",
    category: "Personal",
    date: "04 Jan 2024",
    tags: ["ui", "design"],
  },
];

// Service Layer Endpoints Prepared for Backend Integration
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      return response.data;
    } catch {
      // Fallback mock authentication
      return {
        token: "mock-jwt-token-cloudnest",
        user: {
          name: "Kartik Lohate",
          email: credentials.email || "kartiklohate8@gmail.com",
          role: "Pro Administrator",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post("/api/auth/signup", userData);
      return response.data;
    } catch {
      return {
        token: "mock-jwt-token-cloudnest",
        user: {
          name: userData.name || "Kartik Lohate",
          email: userData.email,
          role: "Pro User",
        },
      };
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
};

export const fileService = {
  getFiles: async (params = {}) => {
    try {
      const response = await api.get("/api/files", { params });
      return response.data;
    } catch {
      return null;
    }
  },

  uploadFile: async (formData) => {
    try {
      const response = await api.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch {
      return null;
    }
  },

  getFile: async (id) => {
    try {
      const response = await api.get(`/api/files/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  downloadFile: async (id) => {
    try {
      const response = await api.get(`/api/files/${id}/download`, {
        responseType: "blob",
      });
      return response.data;
    } catch {
      return null;
    }
  },

  deleteFile: async (id) => {
    try {
      const response = await api.delete(`/api/files/${id}`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  updateFile: async (id, data) => {
    try {
      const response = await api.put(`/api/files/${id}`, data);
      return response.data;
    } catch {
      return { success: true, data };
    }
  },

  getTrash: async () => {
    try {
      const response = await api.get("/api/files/trash");
      return response.data;
    } catch {
      return null;
    }
  },

  restoreFile: async (id) => {
    try {
      const response = await api.put(`/api/files/${id}/restore`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  permanentDelete: async (id) => {
    try {
      const response = await api.delete(`/api/files/${id}/permanent`);
      return response.data;
    } catch {
      return { success: true };
    }
  },
};

export default api;
