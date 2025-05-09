import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  test: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const test = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/test", {
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });

      if (!response.ok) {
        throw new Error("Fetch failed");
      }

      const testData = await response.json();
      const user = testData.filter(
        (user: { email: string; password: string }) =>
          user.email === email && user.password === password,
      )[0];

      if (user && user.email === email && user.password === password) {
        setUser({
          id: user.id,
          email: user.email,
          role: user.role,
        });
        console.warn(" test user:", user);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Test auth function error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, test }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
