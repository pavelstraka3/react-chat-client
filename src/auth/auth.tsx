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
  }) => Promise<LoginResult>;
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

type LoginResult = {
  error: string | null;
  success: boolean;
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
  }): Promise<LoginResult> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { error: "Invalid credentials", success: false };
      }

      const data: LoginResponse = await response.json();
      if (!data.token) {
        return { error: "Something went wrong", success: false };
      }

      setToken(data.token);
      setStoredToken(data.token);

      await new Promise(resolve => setTimeout(resolve, 0));

      return { error: null, success: true };
    } catch (e) {
      console.error(e);
      return { error: "Something went wrong", success: false };
    }
  };

  const register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
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
