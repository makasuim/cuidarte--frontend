import { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  nombre: string;
  rol: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};