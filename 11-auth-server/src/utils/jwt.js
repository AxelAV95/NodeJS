const jwt = require('jsonwebtoken');
require("dotenv").config()
const { JWT_SECRET } = process.env;

exports.signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};