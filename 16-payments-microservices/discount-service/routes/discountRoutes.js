const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createDiscount, validateDiscount, updateDiscount, deleteDiscount } = require('../controllers/discountController');

const router = express.Router();

router.post('/', authMiddleware, createDiscount);
router.get('/validate/:code', validateDiscount);
router.put('/:id', authMiddleware, updateDiscount);
router.delete('/:id', authMiddleware, deleteDiscount);

module.exports = router;