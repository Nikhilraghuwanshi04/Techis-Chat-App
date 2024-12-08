import { create } from 'zustand';
import { auth } from '../services/api';
import { socketService } from '../services/socket';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  initialize: () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        socketService.connect(token);
        set({ user, initialized: true });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, initialized: true });
      }
    } else {
      set({ initialized: true, user: null });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userData = await auth.login(email, password);
      const user: User = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        online: true,
        token: userData.token
      };
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(user));
      socketService.connect(userData.token);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: errorMessage, loading: false, user: null });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userData = await auth.register(name, email, password);
      const user: User = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        online: true,
        token: userData.token
      };
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(user));
      socketService.connect(userData.token);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: errorMessage, loading: false, user: null });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null })
}));