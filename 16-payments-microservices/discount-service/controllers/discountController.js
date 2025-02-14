const Discount = require('../models/discountModel');

const createDiscount = async (req, res) => {
    const { code, type, value, start_date, end_date, max_uses } = req.body;

    try {
        const discountId = await Discount.create({ code, type, value, start_date, end_date, max_uses });
        res.status(201).json({ discountId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el descuento' });
    }
};

const validateDiscount = async (req, res) => {
    const { code } = req.params;

    try {
        const discount = await Discount.findByCode(code);
        if (!discount) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }

        // Verificar si el cupón ha expirado
        const currentDate = new Date();
        if (currentDate < new Date(discount.start_date)) {
            return res.status(400).json({ message: 'El cupón no está disponible aún' });
        }
        if (currentDate > new Date(discount.end_date)) {
            return res.status(400).json({ message: 'El cupón ha expirado' });
        }

        // Verificar si se ha alcanzado el límite de usos
        if (discount.max_uses && discount.used_count >= discount.max_uses) {
            return res.status(400).json({ message: 'El cupón ha alcanzado su límite de usos' });
        }

        res.json(discount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al validar el cupón' });
    }
};

const updateDiscount = async (req, res) => {
    const discountId = req.params.id;
    const { code, type, value, start_date, end_date, max_uses } = req.body;

    try {
        const updated = await Discount.update(discountId, { code, type, value, start_date, end_date, max_uses });
        if (!updated) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }

        res.json({ message: 'Cupón actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el cupón' });
    }
};

const deleteDiscount = async (req, res) => {
    const discountId = req.params.id;

    try {
        const deleted = await Discount.delete(discountId);
        if (!deleted) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }

        res.json({ message: 'Cupón eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cupón' });
    }
};

module.exports = { createDiscount, validateDiscount, updateDiscount, deleteDiscount };