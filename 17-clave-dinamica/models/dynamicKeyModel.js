const db = require('../config/db');

const DynamicKeyModel = {
  async generateDynamicKeys(userId) {
    const values = [];
    for (let fila = 1; fila <= 5; fila++) {
      for (let col of 'ABCDEFGHIJ') {
        const valor = Math.floor(Math.random() * 99) + 1;
        values.push([userId, fila, col, valor]);
      }
    }
    await db.query(
      'INSERT INTO Claves_Dinamicas (id_usuario, fila, columna, valor) VALUES ?',
      [values]
    );
  },

  async getDynamicKeyValues(userId, positions) {
    const conditions = positions.map(([fila, col]) => `(fila = ${fila} AND columna = '${col}')`).join(' OR ');
    const [rows] = await db.query(
      `SELECT valor FROM Claves_Dinamicas WHERE id_usuario = ? AND (${conditions})`,
      [userId]
    );
    if (rows.length !== 3) throw new Error('Error al recuperar claves dinámicas');
    return rows.map(row => row.valor);
  },
};

module.exports = DynamicKeyModel;