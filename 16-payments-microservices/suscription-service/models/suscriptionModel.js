const db = require('../config/db');

class Subscription {
    static async create(subscription) {
        const { user_id, plan_id, start_date, end_date, status } = subscription;
        const [result] = await db.execute(
            'INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, plan_id, start_date, end_date, status]
        );
        return result.insertId;
    }

    static async findById(subscriptionId) {
        const [rows] = await db.execute('SELECT * FROM subscriptions WHERE id = ?', [subscriptionId]);
        return rows[0];
    }

    static async update(subscriptionId, subscriptionData) {
        const { start_date, end_date, status } = subscriptionData;
        const [result] = await db.execute(
            'UPDATE subscriptions SET start_date = ?, end_date = ?, status = ? WHERE id = ?',
            [start_date, end_date, status, subscriptionId]
        );
        return result.affectedRows > 0;
    }

    static async delete(subscriptionId) {
        const [result] = await db.execute('DELETE FROM subscriptions WHERE id = ?', [subscriptionId]);
        return result.affectedRows > 0;
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM subscriptions WHERE user_id = ?', [userId]);
        return rows;
    }
}

module.exports = Subscription;