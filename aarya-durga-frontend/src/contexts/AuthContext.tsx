import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
    id: string;
    email: string;
    fullName: string;
    memberSince: string;
    lastLogin: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, fullName: string) => Promise<void>;
    register: (email: string, fullName: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("temple-user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email: string, fullName: string) => {
        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const newUser: User = {
            id: "1",
            email,
            fullName,
            memberSince: "March 2026",
            lastLogin: new Date().toLocaleString(),
        };
        setUser(newUser);
        localStorage.setItem("temple-user", JSON.stringify(newUser));
    };

    const register = async (email: string, fullName: string) => {
        // Mock register delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const newUser: User = {
            id: "1",
            email,
            fullName,
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            lastLogin: new Date().toLocaleString(),
        };
        setUser(newUser);
        localStorage.setItem("temple-user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("temple-user");
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem("temple-user", JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
