const db = require('../config/db');

class Payment {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM payments');
        return rows;
    }
}

module.exports = Payment;