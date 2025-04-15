import { createContext, ReactNode, useContext, useState } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<string | null>;
  register: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<string | null>;
  logout: () => void;
};

export type LoginResponse = {
  token: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken() {
  return localStorage.getItem("token");
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const isAuthenticated = !!token;

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch("http://localhost:8090/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return "Invalid credentials";
    }

    const data: LoginResponse = await response.json();
    if (!data.token) {
      return "Something went wrong";
    }

    setToken(data.token);
    setStoredToken(data.token);

    return null;
  };

  const register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch("http://localhost:8090/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return "Something went wrong.";
    }

    return null;
  };

  const logout = () => {
    setToken("");
    setStoredToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
