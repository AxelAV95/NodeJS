const db = require('../config/db');

class Subscription {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM subscriptions');
        return rows;
    }
}

module.exports = Subscription;