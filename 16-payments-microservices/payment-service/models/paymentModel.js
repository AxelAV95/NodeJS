const db = require('../config/db');

class Payment {
    static async create(payment) {
        const { user_id, subscription_id, amount, payment_method, status, transaction_id } = payment;
        const [result] = await db.execute(
            'INSERT INTO payments (user_id, subscription_id, amount, payment_method, status, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, subscription_id, amount, payment_method, status, transaction_id]
        );
        return result.insertId;
    }

    static async findByTransactionId(transactionId) {
        const [rows] = await db.execute('SELECT * FROM payments WHERE transaction_id = ?', [transactionId]);
        return rows[0];
    }

    static async updateStatus(transactionId, status) {
        const [result] = await db.execute(
            'UPDATE payments SET status = ? WHERE transaction_id = ?',
            [status, transactionId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Payment;