import axios from 'axios';

// ¡IMPORTANTE! Cambia esta URL por la IP de tu red local o la URL pública de tu backend si la tienes
// Para desarrollo:
// Si usas un emulador Android o iOS, 'http://10.0.2.2:5000' para Android, 'http://localhost:5000' para iOS
// Si usas un dispositivo físico en la misma red Wi-Fi, necesitas la IP de tu ordenador (Ej: 'http://192.168.1.XX:5000')
const API_URL = 'https://reco-fullstack.onrender.com'; // ¡Reemplaza XX con tu IP real!

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;