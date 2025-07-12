require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // El puerto de tu servidor

// Middleware
app.use(express.json()); // Para parsear el body de las peticiones JSON
app.use(cors({ origin: '*' })); // Habilita CORS para permitir peticiones desde tu frontend

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); // Sale del proceso con error
    }
};

// Llama a la función para conectar a la base de datos
connectDB();

// Definir Rutas
app.use('/api/auth', require('./routes/authRoutes')); // Rutas de autenticación
app.use('/api/events', require('./routes/eventRoutes')); // Rutas de eventos

// Ruta de prueba inicial (puedes mantenerla o eliminarla)
app.get('/', (req, res) => {
    res.send('API de RECO en funcionamiento!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});