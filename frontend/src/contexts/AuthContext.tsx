import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from "../lib/apiClient";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    institut: string;
    is_staff: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('JWT_STORAGE_KEY');
        if (token) {
            fetchUser();
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/users/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
            logout();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/token/obtain/', {
                username: email,
                password: password,
            });

            console.log('Réponse de connexion:', response.data); // Log de la réponse complète
            const { access, refresh, user: userData } = response.data;
            console.log('Token d\'accès:', access); // Log du token d'accès
            console.log('Token de rafraîchissement:', refresh); // Log du token de rafraîchissement
            localStorage.setItem('JWT_STORAGE_KEY', access);
            localStorage.setItem('cantine_refresh_token', refresh);
            setUser(userData);
            navigate('/');
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('JWT_STORAGE_KEY');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};