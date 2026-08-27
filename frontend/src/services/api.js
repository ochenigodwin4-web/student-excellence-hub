import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
};

// Profile APIs
export const profileAPI = {
  getMe: () => api.get('/profile/me/'),
  getDashboard: (id) => api.get(`/profile/${id}/dashboard/`),
  updateProfile: (id, data) => api.patch(`/profile/${id}/`, data),
};

// Course APIs
export const courseAPI = {
  getAll: (filters = {}) => api.get('/courses/', { params: filters }),
  getById: (id) => api.get(`/courses/${id}/`),
  getLessons: (id) => api.get(`/courses/${id}/lessons/`),
  enroll: (id) => api.post(`/courses/${id}/enroll/`),
};

// Enrollment APIs
export const enrollmentAPI = {
  getAll: () => api.get('/enrollments/'),
  updateProgress: (id, progress) => api.post(`/enrollments/${id}/update_progress/`, { progress }),
};

// Forum APIs
export const forumAPI = {
  getPosts: (filters = {}) => api.get('/forum/posts/', { params: filters }),
  getPostById: (id) => api.get(`/forum/posts/${id}/`),
  createPost: (data) => api.post('/forum/posts/', data),
  likePost: (id) => api.post(`/forum/posts/${id}/like/`),
  addComment: (id, content) => api.post(`/forum/posts/${id}/add_comment/`, { content }),
};

// Achievement APIs
export const achievementAPI = {
  getAll: () => api.get('/achievements/'),
  getMyAchievements: () => api.get('/user-achievements/'),
};

// Goal APIs
export const goalAPI = {
  getAll: () => api.get('/goals/'),
  create: (data) => api.post('/goals/', data),
  update: (id, data) => api.patch(`/goals/${id}/`, data),
  updateProgress: (id, progress) => api.post(`/goals/${id}/update_progress/`, { progress }),
  delete: (id) => api.delete(`/goals/${id}/`),
};

// Progress APIs
export const progressAPI = {
  getAll: () => api.get('/progress/'),
  create: (data) => api.post('/progress/', data),
  getWeeklyStats: () => api.get('/progress/weekly_stats/'),
};

export default api;
