import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export type Subscription = "free" | "premium";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  subscription: Subscription;
  unreadNotifications: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  logout: () => Promise<void>;
}

export type UseAuthReturn = AuthState & AuthActions;

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const api = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${api}/users/me`, {
          withCredentials: true
        })
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await axios.post(`${api}/users/logout`,
        {}, {
        withCredentials: true
      });

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout
  };
}