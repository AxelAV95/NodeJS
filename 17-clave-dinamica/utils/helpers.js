const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateRandomPositions = () => {
  const positions = [];
  const filas = [1, 2, 3, 4, 5];
  const columnas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  while (positions.length < 3) {
    const fila = filas[Math.floor(Math.random() * filas.length)];
    const col = columnas[Math.floor(Math.random() * columnas.length)];
    const pos = `${col}${fila}`;
    if (!positions.includes(pos)) positions.push([fila, col]);
  }
  return positions;
};

const generateToken = (userId, positions, expiresIn = '15m') => {
  return jwt.sign({ userId, positions }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = { generateRandomPositions, generateToken };