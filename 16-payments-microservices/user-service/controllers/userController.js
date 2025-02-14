const User = require('../models/userModel');

const getUser = async (req, res) => {
    const userId = req.userId; // Obtenido del middleware de autenticación

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.userId;
    const { name, email } = req.body;

    try {
        const updated = await User.update(userId, { name, email });
        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.userId;

    try {
        const deleted = await User.delete(userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { getUser, updateUser, deleteUser };