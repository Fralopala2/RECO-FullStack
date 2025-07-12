import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native'; // Puedes dejarlo por si lo necesitas, si no puedes quitarlo

// Importa las pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EventListScreen from './screens/EventListScreen';
import EventFormScreen from './screens/EventFormScreen';

// Importa el AuthContext
import { AuthContext, AuthProvider } from './context/AuthContext';

const Stack = createNativeStackNavigator();

function AuthStackScreens() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // Puedes mostrar un SplashScreen aquí si lo deseas
  }

  return (
    <Stack.Navigator>
        {userToken ? (
          // Rutas para usuarios logueados
          <>
            <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Mis Eventos' }} />
            <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Gestionar Evento' }} />
          </>
        ) : (
          // Rutas para usuarios no logueados (autenticación)
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrarse' }} />
          </>
        )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthStackScreens />
      </NavigationContainer>
    </AuthProvider>
  );
}