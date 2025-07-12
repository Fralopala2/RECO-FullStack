const jwt = require('jsonwebtoken');

// Clave secreta para firmar y verificar los tokens.
// ¡IMPORTANTE! En un entorno de producción, esta clave debería ser una variable de entorno
const jwtSecret = 'supersecretkey123'; // ¡Cambia esto por una cadena más segura en producción!

const auth = (req, res, next) => {
    // Obtener el token de la cabecera
    const token = req.header('x-auth-token');

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, jwtSecret);

        // Añadir el usuario del token al objeto de la petición
        req.user = decoded.user;
        next(); // Continuar con la siguiente función de middleware/ruta
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = auth;