import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
  role: "client" | "brewer" | "admin";
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  token: string | null;
  setToken: (token: string) => void;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  logout: () => void;
  test: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const json = await response.json();

    if (!json.user || !json.token) {
      throw new Error("Invalid response format from server");
    }

    return json;
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
    <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout, test }}>
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
