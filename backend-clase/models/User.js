const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Asegura que cada email sea único
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Fecha de creación del usuario
    }
});

module.exports = mongoose.model('User', UserSchema);