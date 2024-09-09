const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    usuarioid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuarionombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    usuarioapellidos: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    usuariocedula: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    usuariopassword: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'tbusuario', 
    timestamps: false 
  });
  

module.exports = User