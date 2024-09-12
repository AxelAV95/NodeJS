const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de que esta ruta apunte a tu conexión de Sequelize

const Envelope = sequelize.define('Envelope', {
  sobreid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  sobrenombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  sobremonto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sobreCuentaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tbsobre', // Nombre de la tabla en la base de datos
  timestamps: false // Si la tabla no tiene campos de timestamps (createdAt, updatedAt)
});

module.exports = Envelope;