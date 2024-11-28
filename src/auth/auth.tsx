import {createContext, ReactNode, useContext, useEffect, useState} from "react";

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
  username?: string;
};

export type LoginResponse = {
  token: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

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

    // Directly set all states to trigger rerender
    setToken(data.token);
    setUsername(username);
    setIsAuthenticated(true);

    // Optionally store the token in localStorage to persist the session
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);
    return null;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    setUsername("");

    // Clear from localStorage
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, username }}
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
