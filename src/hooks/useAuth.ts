import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axios';
import { isAxiosError } from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  address?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await axiosInstance.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
      return response.data;
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message || 'Chyba při přihlášení');
      }
      throw new Error('Chyba při přihlášení');
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message || 'Chyba při registraci');
      }
      throw new Error('Chyba při registraci');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout
  };
} 