const db = require('../config/db');

class PayPalSubscription {
    static async create(subscription) {
        const { user_id, plan_id, agreement_id, status } = subscription;
        const [result] = await db.execute(
            'INSERT INTO paypal_subscriptions (user_id, plan_id, agreement_id, status) VALUES (?, ?, ?, ?)',
            [user_id, plan_id, agreement_id, status]
        );
        return result.insertId;
    }

    static async findByAgreementId(agreementId) {
        const [rows] = await db.execute('SELECT * FROM paypal_subscriptions WHERE agreement_id = ?', [agreementId]);
        return rows[0];
    }

    static async updateStatus(agreementId, status) {
        const [result] = await db.execute(
            'UPDATE paypal_subscriptions SET status = ? WHERE agreement_id = ?',
            [status, agreementId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = PayPalSubscription;