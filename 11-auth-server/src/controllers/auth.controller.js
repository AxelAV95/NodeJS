const User = require("../models/user");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const jwt = require('../utils/jwt');

const register = async (req, res) => {
    try {
        // Verificar si el usuario ya existe
        const isExists = await User.findOne({ where: { usuarioemail: req.body.email } });

        if (isExists) {
            return res.status(400).json({
                message: "Ya se ha creado una cuenta con este email."
            });
        }

        // Generar salt y hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        // Crear un nuevo usuario    
        const user = await User.create({
            usuarioemail: req.body.email,
            usuariopassword: hash
        })
    
        // Extraer la contraseña del objeto de usuario
        const { usuariopassword, ...userData } = user.toJSON();

        return res.status(200).json({ userData });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        // Buscar el usuario por email
        const user = await User.findOne({ where: { usuarioemail: req.body.email } });

        if (!user) {
            return res.status(404).json({
                message: "El usuario no se encuentra registrado"
            });
        }

        // Verificar la contraseña
        const isValidPw = await bcrypt.compare(req.body.password, user.usuariopassword);

        if (!isValidPw) {
            return res.status(400).json({
                message: "La contraseña no es válida"
            });
        }

        // Generar token JWT
        const token = jwt.signToken({ id: user._id });

        // Extraer la contraseña del objeto de usuario
        const { usuariopassword, ...userData } = user.toJSON();

        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ userData, token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Se ha cerrado sesión exitosamente' });
};

const test = async (req, res) => {
    res.send("Hello from the express server")
}
module.exports = { register, login, logout, test };