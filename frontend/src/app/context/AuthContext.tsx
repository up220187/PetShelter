"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  usuId: string;
  usuNombre: string;
  usuCorreo: string;
  usuRol?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");
        
        if (storedToken && storedUser) {
          // Validar que el JSON del usuario sea válido
          try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
            // Limpiar datos corruptos
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
          }
        }
      } catch (error) {
        console.error('Error loading auth data from localStorage:', error);
        // En caso de error, limpiar localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const validateToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return true;
      } else {
        // Token inválido, limpiar sesión
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error validating token:', error);
      // En caso de error de red, no cerrar sesión automáticamente
      // Solo retornar false pero mantener el token
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
