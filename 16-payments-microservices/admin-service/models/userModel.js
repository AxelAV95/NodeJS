const db = require('../config/db');

class User {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    }

    static async updateRole(userId, role) {
        const [result] = await db.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = User;