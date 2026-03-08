import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { AdminUser } from '@/api/auth';

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate on mount
  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const user = await auth.me();
          setAdmin(user);
        } catch (err) {
          localStorage.removeItem('admin_token');
        }
      }
      setIsLoading(false);
    };

    hydrate();
  }, []);

  const adminLogin = async (email: string, password: string) => {
    const response = await auth.login(email, password);
    localStorage.setItem('admin_token', response.access_token);
    setAdmin(response.admin);
  };

  const adminLogout = async () => {
    try {
      await auth.logout();
    } catch {
      // Logout endpoint may fail, but still clear local state
    }
    localStorage.removeItem('admin_token');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
