import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para almacenar el token de forma persistente

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null); // Almacena el token JWT
    const [isLoading, setIsLoading] = useState(true); // Para saber si estamos cargando la sesión

    useEffect(() => {
        // Función para cargar el token al iniciar la app
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setUserToken(token);
                }
            } catch (e) {
                console.error('Error al cargar el token de AsyncStorage:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    // Función de login
    const login = async (token) => {
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token); // Guardar el token
    };

    // Función de logout
    const logout = async () => {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken'); // Eliminar el token
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};