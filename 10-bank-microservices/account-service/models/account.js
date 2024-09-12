const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Account = sequelize.define('Account', {
  cuentaid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
    allowNull: false
  },
  cuentaconcepto: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  cuentaIBAN: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cuentaMonto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cuentaUsuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tbcuenta', // Nombre de la tabla en la base de datos
  timestamps: false // Si la tabla no tiene campos de timestamps (createdAt, updatedAt)
});

module.exports = Account;