const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Esto es una referencia a otro documento
        ref: 'User', // Indica que se refiere al modelo 'User'
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: { // Tipo de evento: 'examen', 'tarea', 'entrega'
        type: String,
        enum: ['examen', 'tarea', 'entrega','recordatorio'],
        required: true
    },
    dueDate: { // Fecha de entrega o realización
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);