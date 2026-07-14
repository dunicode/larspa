import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile(token);
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const login = async (newToken) => {
        setIsLoading(true);
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
    };

    const logoutUser = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
    };

    const logout = async () => {
        try {
            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Error during API logout:', error);
        } finally {
            logoutUser();
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
