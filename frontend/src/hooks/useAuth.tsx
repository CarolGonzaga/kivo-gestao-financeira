import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, AuthState, LoginFormData, SignupFormData } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - replace with actual API calls
const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao@example.com",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (data: LoginFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock validation - in production, this would be an API call
    if (data.email && data.password) {
      setState({
        user: { ...mockUser, email: data.email },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Credenciais inválidas");
    }
  }, []);

  const signup = useCallback(async (data: SignupFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock registration
    setState({
      user: { id: "new-user", name: data.name, email: data.email },
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
