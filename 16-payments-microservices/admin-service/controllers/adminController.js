const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const Payment = require('../models/paymentModel');
const Discount = require('../models/discountModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.json(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las suscripciones' });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los pagos' });
    }
};

const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.findAll();
        res.json(discounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los descuentos' });
    }
};

const updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    try {
        const updated = await User.updateRole(userId, role);
        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
    }
};

module.exports = { getAllUsers, getAllSubscriptions, getAllPayments, getAllDiscounts, updateUserRole };