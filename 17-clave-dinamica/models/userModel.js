const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Usuarios (nombre_usuario, contraseña) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return result.insertId;
  },

  async findUserByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM Usuarios WHERE nombre_usuario = ?',
      [username]
    );
    if (!rows.length) throw new Error('Usuario no encontrado');
    return rows[0];
  },
};

module.exports = UserModel;