const db = require('../config/db');

class User {
    static async findById(userId) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        return rows[0];
    }

    static async update(userId, userData) {
        const { name, email } = userData;
        const [result] = await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(userId) {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = User;