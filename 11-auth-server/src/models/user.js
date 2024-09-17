const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define('User', {
    usuarioid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuarioemail: {
      type: DataTypes.STRING(100),
      allowNull: false
    },    
    usuariopassword: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  }, {
    tableName: 'tbusuario', 
    timestamps: true 
  });
  

module.exports = User