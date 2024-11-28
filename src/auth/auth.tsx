import { createContext, ReactNode, useContext, useState } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<string | null>;
  logout: () => void;
};

export type LoginResponse = {
  token: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response = await fetch("http://localhost:8090/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return "Invalid credentials";
    }

    const data: LoginResponse = await response.json();
    if (!data.token) {
      return "Something went wrong";
    }

    setToken(data.token);
    setIsAuthenticated(true);
    return null;
  };
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
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
