const db = require('../config/db');

class Discount {
    static async create(discount) {
        const { code, type, value, start_date, end_date, max_uses } = discount;
        const [result] = await db.execute(
            'INSERT INTO discounts (code, type, value, start_date, end_date, max_uses) VALUES (?, ?, ?, ?, ?, ?)',
            [code, type, value, start_date, end_date, max_uses]
        );
        return result.insertId;
    }

    static async findByCode(code) {
        const [rows] = await db.execute('SELECT * FROM discounts WHERE code = ?', [code]);
        return rows[0];
    }

    static async update(discountId, discountData) {
        const { code, type, value, start_date, end_date, max_uses } = discountData;
        const [result] = await db.execute(
            'UPDATE discounts SET code = ?, type = ?, value = ?, start_date = ?, end_date = ?, max_uses = ? WHERE id = ?',
            [code, type, value, start_date, end_date, max_uses, discountId]
        );
        return result.affectedRows > 0;
    }

    static async delete(discountId) {
        const [result] = await db.execute('DELETE FROM discounts WHERE id = ?', [discountId]);
        return result.affectedRows > 0;
    }

    static async incrementUseCount(discountId) {
        const [result] = await db.execute(
            'UPDATE discounts SET used_count = used_count + 1 WHERE id = ?',
            [discountId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Discount;