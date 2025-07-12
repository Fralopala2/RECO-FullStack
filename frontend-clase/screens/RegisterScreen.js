import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/axios'; // Importa la instancia de axios configurada
import { AuthContext } from '../context/AuthContext'; // Importa el contexto de autenticación

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // Obtiene la función login para guardar el token tras el registro

    const handleRegister = async () => {
        try {
            const response = await api.post('/api/auth/register', { name, email, password });
            const { token } = response.data;
            await login(token); // Guarda el token en el contexto y AsyncStorage
            Alert.alert('Éxito', 'Usuario registrado y sesión iniciada');
        } catch (error) {
            console.error('Error de registro:', error.response ? error.response.data : error.message);
            Alert.alert('Error', error.response ? error.response.data.msg : 'Error al registrar usuario');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrarse</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Registrar" onPress={handleRegister} />
            <View style={styles.linkContainer}>
                <Text>¿Ya tienes cuenta?</Text>
                <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 28,
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    linkContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
});

export default RegisterScreen;