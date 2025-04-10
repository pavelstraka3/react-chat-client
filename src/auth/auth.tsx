import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

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

    // Directly set all states to trigger rerender
    setToken(data.token);
    setIsAuthenticated(true);

    // Optionally store the token in localStorage to persist the session
    localStorage.setItem("token", data.token);
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
    setIsAuthenticated(false);
    setToken("");

    // Clear from localStorage
    localStorage.removeItem("token");
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
