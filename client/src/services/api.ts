import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users/register', { name, email, password });
    return response.data;
  },
};

export const chats = {
  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },
  createChat: async (participantId: string) => {
    const response = await api.post('/chats', { participantId });
    return response.data;
  },
  getMessages: async (chatId: string) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },
  sendMessage: async (chatId: string, content: string) => {
    const response = await api.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  },
};

export default api;