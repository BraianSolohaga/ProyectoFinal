// hooks/useAuth.js

import { useState, useEffect } from 'react';
import { Api } from '../service/Api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);

                    Api.setToken(storedToken);
                }
            } catch (error) {
                console.error('Error loading auth data:', error);

                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);


    const clearAuthData = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        Api.clearToken();
        Api.clearCurrentUser();
    };


    const saveAuthData = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        Api.setToken(userToken);
        Api.setCurrentUser(userData);
    };


    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await Api.login({ email, password });


            if (response && response.user && response.token) {
                saveAuthData(response.user, response.token);
                return { success: true, data: response };
            } else if (response && response.data && response.data.user && response.data.token) {

                saveAuthData(response.data.user, response.data.token);
                return { success: true, data: response.data };
            } else {
                throw new Error('Respuesta de login inválida');
            }
        } catch (error) {
            const errorMessage = error.message || 'Error al iniciar sesión';
            setError(errorMessage);
            clearAuthData();
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };


    const register = async (userData) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await Api.register(userData);

            if (response && response.user && response.token) {
                saveAuthData(response.user, response.token);
                return { success: true, data: response };
            } else if (response && response.data && response.data.user && response.data.token) {
                saveAuthData(response.data.user, response.data.token);
                return { success: true, data: response.data };
                return { success: true, data: response, requiresLogin: true };
            }
        } catch (error) {
            const errorMessage = error.message || 'Error al registrarse';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            if (token) {
                try {
                    await Api.logout();
                } catch (error) {
                    console.warn('Error during server logout:', error);
                }
            }

            clearAuthData();
            return { success: true };
            clearAuthData();
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };
    return !!(user && token);
};
const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    Api.setCurrentUser(newUserData);

    const refreshUser = async () => {
        try {
            if (!user || !user.id) return { success: false, error: 'No user ID' };

            setIsLoading(true);
            const response = await Api.getUserById(user.id);

            if (response && response.data) {
                updateUser(response.data);
                return { success: true, data: response.data };
            }

            return { success: false, error: 'No user data received' };
        } catch (error) {
            const errorMessage = error.message || 'Error al actualizar usuario';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {

        user,
        token,
        isLoading,
        error,

        login,
        register,
        logout,

        isAuthenticated,
        updateUser,
        refreshUser,
        clearError,
        setUser: updateUser,
    };
};