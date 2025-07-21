import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3301/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  timeout: 10000,
});

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    login: () => window.location.href = `${API_BASE_URL}/auth/login`,
    autoLogin: () => api.post('/auth/auto-login'),
  },
  
  // User endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
  },
  
  // Training endpoints
  training: {
    getAll: () => api.get('/training'),
    getById: (id: string) => api.get(`/training/${id}`),
    markComplete: (id: string) => api.post(`/training/${id}/complete`),
    getProgress: () => api.get('/training/progress/summary'),
  },
  
  // Events endpoints
  events: {
    getAll: () => api.get('/events'),
    getById: (id: string) => api.get(`/events/${id}`),
    rsvp: (id: string, attending: boolean) => api.post(`/events/${id}/rsvp`, { attending }),
  },
  
  // Documents endpoints
  documents: {
    getAll: () => api.get('/documents'),
    getFolders: () => api.get('/documents/folders'),
    getFolderContents: (folderId: string) => api.get(`/documents/folders/${folderId}`),
  },
  
  // Admin endpoints
  admin: {
    getUsers: () => api.get('/admin/users'),
    getUser: (id: string) => api.get(`/admin/users/${id}`),
    updateUserRoles: (id: string, roles: string[]) => api.put(`/admin/users/${id}/roles`, { roles }),
    assignTraining: (userId: string, trainingId: string, dueDate: string) => 
      api.post(`/admin/users/${userId}/training`, { trainingId, dueDate }),
    getStats: () => api.get('/admin/stats'),
    createAnnouncement: (data: any) => api.post('/admin/announcements', data),
  },
};

export default api;
