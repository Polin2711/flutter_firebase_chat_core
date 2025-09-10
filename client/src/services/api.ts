import axios, { AxiosResponse } from 'axios';
import { User, Message, Rank, AuthResponse, OnlineUser } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/logout');
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.put('/users/profile', profileData);
    return response.data;
  },
};

export const chatAPI = {
  getMessages: async (page: number = 1, limit: number = 50): Promise<{
    messages: Message[];
    pagination: { page: number; limit: number; hasMore: boolean };
  }> => {
    const response: AxiosResponse<{
      messages: Message[];
      pagination: { page: number; limit: number; hasMore: boolean };
    }> = await api.get(`/chat/messages?page=${page}&limit=${limit}`);
    return response.data;
  },

  sendMessage: async (content: string, type: string = 'text', replyTo?: string): Promise<{
    message: string;
    newMessage: Message;
  }> => {
    const response: AxiosResponse<{
      message: string;
      newMessage: Message;
    }> = await api.post('/chat/messages', {
      content,
      type,
      replyTo,
    });
    return response.data;
  },

  editMessage: async (messageId: string, content: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.put(`/chat/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  addReaction: async (messageId: string, emoji: string): Promise<{
    message: string;
    reactions: any[];
  }> => {
    const response: AxiosResponse<{
      message: string;
      reactions: any[];
    }> = await api.post(`/chat/messages/${messageId}/reactions`, { emoji });
    return response.data;
  },

  removeReaction: async (messageId: string): Promise<{
    message: string;
    reactions: any[];
  }> => {
    const response: AxiosResponse<{
      message: string;
      reactions: any[];
    }> = await api.delete(`/chat/messages/${messageId}/reactions`);
    return response.data;
  },
};

export const userAPI = {
  getUsers: async (): Promise<{ users: User[] }> => {
    const response: AxiosResponse<{ users: User[] }> = await api.get('/users');
    return response.data;
  },

  getUser: async (userId: string): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get(`/users/${userId}`);
    return response.data;
  },

  getOnlineUsers: async (): Promise<{ onlineUsers: OnlineUser[] }> => {
    const response: AxiosResponse<{ onlineUsers: OnlineUser[] }> = await api.get('/users/online/list');
    return response.data;
  },
};

export const rankAPI = {
  getRanks: async (): Promise<{ ranks: Rank[] }> => {
    const response: AxiosResponse<{ ranks: Rank[] }> = await api.get('/ranks');
    return response.data;
  },

  getRank: async (rankId: string): Promise<{ rank: Rank }> => {
    const response: AxiosResponse<{ rank: Rank }> = await api.get(`/ranks/${rankId}`);
    return response.data;
  },

  getUsersByRank: async (rankId: string): Promise<{
    rank: Rank;
    users: User[];
  }> => {
    const response: AxiosResponse<{
      rank: Rank;
      users: User[];
    }> = await api.get(`/ranks/${rankId}/users`);
    return response.data;
  },

  getRankStats: async (): Promise<{
    rankStats: Array<{
      rank: Rank;
      userCount: number;
    }>;
  }> => {
    const response: AxiosResponse<{
      rankStats: Array<{
        rank: Rank;
        userCount: number;
      }>;
    }> = await api.get('/ranks/stats/overview');
    return response.data;
  },
};

export default api;