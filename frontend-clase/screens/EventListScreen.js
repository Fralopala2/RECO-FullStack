import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // ¡NUEVA IMPORTACIÓN!
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const EventListScreen = ({ navigation }) => {
    const { userToken, logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true); // Asegurarse de que el indicador de carga se muestre
        try {
            api.defaults.headers.common['x-auth-token'] = userToken;
            const response = await api.get('/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error al cargar eventos:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                Alert.alert('Sesión Expirada', 'Por favor, inicia sesión de nuevo.');
                logout();
            } else {
                Alert.alert('Error', 'No se pudieron cargar los eventos.');
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [userToken, logout]);

    // Este useEffect se encargará de cargar los eventos la primera vez que se monta
    // y cuando el userToken cambie.
    useEffect(() => {
        if (userToken) {
            fetchEvents();
        }
    }, [userToken, fetchEvents]);

    useFocusEffect(
        useCallback(() => {
            if (userToken) {
                fetchEvents();
            }
            // Limpia cualquier suscripción si es necesario, aunque aquí no aplica directamente
            return () => {
                // Opcional: código de limpieza si tuvieras listeners, etc.
            };
        }, [userToken, fetchEvents])
    );

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchEvents();
    }, [fetchEvents]);

    const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <Text style={styles.eventType}>Tipo: {item.type}</Text>
        <Text style={styles.eventDueDate}>Fecha: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <View style={styles.eventActions}> {/* Contenedor para los botones */}
            <Button
                title="Editar"
                onPress={() => navigation.navigate('EventForm', { event: item })} // Pasa el evento para editar
            />
            <Button
                title="Eliminar"
                onPress={() => handleDeleteEvent(item._id)} // Llama a la nueva función
                color="#dc3545" // Color rojo para eliminar
            />
        </View>
    </View>
    );

    const handleDeleteEvent = async (eventId) => {
    Alert.alert(
        "Confirmar Eliminación",
        "¿Estás seguro de que quieres eliminar este evento?",
        [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Eliminar",
                onPress: async () => {
                    try {
                        api.defaults.headers.common['x-auth-token'] = userToken;
                        await api.delete(`/api/events/${eventId}`);
                        Alert.alert('Éxito', 'Evento eliminado correctamente.');
                        fetchEvents(); // Recarga la lista después de eliminar
                    } catch (error) {
                        console.error('Error al eliminar evento:', error.response ? error.response.data : error.message);
                        if (error.response && error.response.status === 401) {
                            Alert.alert('Sesión Expirada', 'Por favor, inicia sesión de nuevo.');
                            logout();
                        } else {
                            Alert.alert('Error', 'No se pudo eliminar el evento.');
                        }
                    }
                },
                style: "destructive"
            }
        ],
        { cancelable: true }
       );
    };

    if (isLoading && !isRefreshing) { // Mostrar indicador de carga solo al inicio o si no es un refresh
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando eventos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Eventos</Text>
            <Button title="Cerrar Sesión" onPress={logout} />

            {events.length === 0 ? (
                <Text style={styles.noEventsText}>No tienes eventos. ¡Crea uno!</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item._id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                />
            )}
            <Button title="Añadir Nuevo Evento" onPress={() => navigation.navigate('EventForm')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    listContent: {
        paddingBottom: 20,
    },
    eventItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#444',
    },
    eventDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    eventType: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
    },
    eventDueDate: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    noEventsText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#777',
    },
    eventActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Alinea los botones a la derecha
        marginTop: 10,
    },
    buttonSpacer: {
        width: 10, // Ancho del espacio entre botones
    }
});

export default EventListScreen;