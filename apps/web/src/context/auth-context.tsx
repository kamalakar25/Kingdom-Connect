import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin, apiClient } from "../utils/api";

type User = {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    role: string;
    locale: string;
    settings?: any;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    googleLogin: (credential: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // Fetch full profile including displayName
            const profile = await apiClient('/users/me');
            if (profile.success) {
                setUser(profile.data);
            } else {
                // If profile fetch fails, try auth/me check or verify token validity
                const authCheck = await apiClient('/auth/me');
                if (authCheck.success) {
                    // Fallback if users/me fails but token is valid
                    setUser(authCheck.data);
                } else {
                    localStorage.removeItem('token');
                }
            }
        } catch (error) {
            console.error("Auth initialization failed", error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await apiLogin(email, password);
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        } else {
            throw new Error(res.message);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        const res = await apiRegister(email, password, name);
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        } else {
            throw new Error(res.message);
        }
    };

    const googleLogin = async (credential: string) => {
        const res = await apiGoogleLogin(credential);
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        } else {
            throw new Error(res.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        const res = await apiClient('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data)
        });

        if (res.success) {
            setUser(prev => prev ? { ...prev, ...res.data } : res.data);
        } else {
            throw new Error(res.message);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            googleLogin,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
