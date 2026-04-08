import React, { createContext, useContext, useState, useCallback } from "react";
import type { User, UserRole } from "@/types";
import axios from "axios";
/* eslint-disable react-refresh/only-export-components */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;

  // ✅ ADD THIS
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = "http://localhost:5000/api/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // LOGIN
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole
    ): Promise<boolean> => {
      try {
        const res = await axios.post(`${API}/register`, {
          name,
          email,
          password,
          role,
        });

        const { user } = res.data;
        setUser(user);

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    [user]
  );

  // ✅ NEW FUNCTION (LIVE UPDATE)
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
        updateUser, // ✅ ADD
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};