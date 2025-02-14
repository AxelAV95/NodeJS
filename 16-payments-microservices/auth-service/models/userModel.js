const db = require('../config/db');

class User {
    static async create(user) {
        const { name, email, password_hash } = user;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, password_hash]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
}

module.exports = User;