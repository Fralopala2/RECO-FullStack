import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Para el selector de tipo de evento
import DateTimePicker from '@react-native-community/datetimepicker'; // Para el selector de fecha y hora
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const EventFormScreen = ({ navigation, route }) => {
    // Si route.params.event existe, significa que estamos editando
    const isEditing = route.params?.event ? true : false;
    const initialEvent = route.params?.event || {};

    const [title, setTitle] = useState(initialEvent.title || '');
    const [description, setDescription] = useState(initialEvent.description || '');
    const [type, setType] = useState(initialEvent.type || 'tarea'); // Valor por defecto
    const [dueDate, setDueDate] = useState(initialEvent.dueDate ? new Date(initialEvent.dueDate) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const { userToken } = useContext(AuthContext);

    // Instala estas librerías si no las tienes:
    // npm install @react-native-picker/picker
    // npm install @react-native-community/datetimepicker
    // npx expo install @react-native-picker/picker @react-native-community/datetimepicker


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dueDate;
        setShowDatePicker(false);
        setDueDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || dueDate;
        setShowTimePicker(false);
        setDueDate(currentTime);
    };

    const handleSaveEvent = async () => {
        try {
            // Asegúrate de que el token esté en los headers por defecto
            api.defaults.headers.common['x-auth-token'] = userToken;

            const eventData = {
                title,
                description,
                type,
                dueDate: dueDate.toISOString(), // Convierte la fecha a formato ISO 8601
            };

            if (isEditing) {
                await api.put(`/api/events/${initialEvent._id}`, eventData);
                Alert.alert('Éxito', 'Evento actualizado correctamente.');
            } else {
                await api.post('/api/events', eventData);
                Alert.alert('Éxito', 'Evento creado correctamente.');
            }

            navigation.goBack(); // Vuelve a la pantalla anterior (EventListScreen)
            // Opcional: navigation.navigate('EventList'); si quieres asegurar que vuelve a la principal
        } catch (error) {
            console.error('Error al guardar evento:', error.response ? error.response.data : error.message);
            Alert.alert('Error', error.response ? error.response.data.msg || 'Error al guardar evento' : 'Error de red');
        }
    };

    const formattedDate = dueDate.toLocaleDateString();
    const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Tipo de Evento:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={type}
                    onValueChange={(itemValue) => setType(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Tarea" value="tarea" />
                    <Picker.Item label="Examen" value="examen" />
                    <Picker.Item label="Entrega" value="entrega" />
                    <Picker.Item label="Recordatorio" value="recordatorio" />
                </Picker>
            </View>

            <Text style={styles.label}>Fecha:</Text>
            <View style={styles.datePickerButtonContainer}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    value={formattedDate}
                    editable={false}
                />
                <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Hora:</Text>
            <View style={styles.datePickerButtonContainer}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    value={formattedTime}
                    editable={false}
                />
                <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
            </View>
            {showTimePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <View style={styles.buttonContainer}>
                <Button title={isEditing ? 'Guardar Cambios' : 'Crear Evento'} onPress={handleSaveEvent} />
                <View style={{ marginVertical: 5 }} /> {/* Espaciador */}
                <Button title="Cancelar" onPress={() => navigation.goBack()} color="#ccc" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        marginTop: 10,
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
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
        overflow: 'hidden', // Asegura que el borde redondo se aplique al contenido del Picker
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerItem: { // Este estilo puede no aplicarse uniformemente en todas las plataformas
        height: 50, // Intentar ajustar altura para iOS/Android
    },
    datePickerButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
    }
});

export default EventFormScreen;