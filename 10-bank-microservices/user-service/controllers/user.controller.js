const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        // Verificar si el usuario ya existe
        const isExists = await User.findOne({ where: { usuariocedula: req.body.cedula } });

        if (isExists) {
            return res.status(400).json({
                message: "Already created an account"
            });
        }

        // Generar salt y hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        // Crear un nuevo usuario    
        const user = await User.create({
            usuarionombre: req.body.nombre,
            usuarioapellidos: req.body.apellidos,
            usuariocedula: req.body.cedula,
            usuariopassword: hash
          })


        

        // Generar token JWT
        const token = jwt.sign({ _id: user.usuarioid }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Extraer la contraseña del objeto de usuario
        const { usuariopassword, ...userData } = user.toJSON();

        return res.status(200).json({ userData, token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        // Buscar el usuario por email
        const user = await User.findOne({ where: { usuariocedula: req.body.cedula } });

        if (!user) {
            return res.status(404).json({
                message: "User is not found"
            });
        }

        // Verificar la contraseña
        const isValidPw = await bcrypt.compare(req.body.password, user.usuariopassword);

        if (!isValidPw) {
            return res.status(400).json({
                message: "Password is wrong"
            });
        }

        // Generar token JWT
        const token = jwt.sign({ _id: user.usuarioid }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Extraer la contraseña del objeto de usuario
        const { usuariopassword, ...userData } = user.toJSON();

        return res.status(200).json({ userData, token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const account = async (req, res) =>{
    try{
        const user = await User.findByPk(req.params.userId)

        if(!user){
            return res.status(404).json({message: "User is not found"})
        }

        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}



module.exports = { register, login, account };