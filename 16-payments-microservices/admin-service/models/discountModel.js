const db = require('../config/db');

class Discount {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM discounts');
        return rows;
    }
}

module.exports = Discount;