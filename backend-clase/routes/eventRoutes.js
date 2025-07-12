const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Importa el middleware de autenticación
const Event = require('../models/Event'); // Importa el modelo de Evento

// @route   POST api/events
// @desc    Crear un nuevo evento
// @access  Private (requiere autenticación)
router.post('/', auth, async (req, res) => {
    const { title, description, type, dueDate } = req.body;

    try {
        const newEvent = new Event({
            user: req.user.id, // El ID del usuario se obtiene del token
            title,
            description,
            type,
            dueDate
        });

        const event = await newEvent.save();
        res.json(event);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET api/events
// @desc    Obtener todos los eventos del usuario autenticado
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Encuentra los eventos que pertenecen al usuario autenticado y ordénalos por fecha
        const events = await Event.find({ user: req.user.id }).sort({ dueDate: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT api/events/:id
// @desc    Actualizar un evento por ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, type, dueDate } = req.body;

    // Construir el objeto del evento
    const eventFields = {};
    if (title) eventFields.title = title;
    if (description) eventFields.description = description;
    if (type) eventFields.type = type;
    if (dueDate) eventFields.dueDate = dueDate;

    try {
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

        // Asegurarse de que el usuario sea el propietario del evento
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true } // Devolver el documento actualizado
        );

        res.json(event);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE api/events/:id
// @desc    Eliminar un evento por ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

        // Asegurarse de que el usuario sea el propietario del evento
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await Event.findByIdAndDelete(req.params.id); // O .remove() en versiones antiguas

        res.json({ msg: 'Evento eliminado' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;