const Subscription = require('../models/subscriptionModel');

// Crear suscripción
const createSubscription = async (req, res) => {
    const { plan_id, start_date, end_date, status } = req.body;
    const user_id = req.userId;

    try {
        const subscriptionId = await Subscription.create({ 
            user_id, 
            plan_id, 
            start_date, 
            end_date, 
            status 
        });
        
        res.status(201).json({ subscriptionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener suscripción por ID
const getSubscription = async (req, res) => {
    const subscriptionId = req.params.id;

    try {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Suscripción no encontrada' });
        }

        res.json(subscription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar suscripción
const updateSubscription = async (req, res) => {
    const subscriptionId = req.params.id;
    const { start_date, end_date, status } = req.body;

    try {
        const updated = await Subscription.update(subscriptionId, { 
            start_date, 
            end_date, 
            status 
        });
        
        if (!updated) {
            return res.status(404).json({ message: 'Suscripción no encontrada' });
        }

        res.json({ message: 'Suscripción actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar suscripción
const deleteSubscription = async (req, res) => {
    const subscriptionId = req.params.id;

    try {
        const deleted = await Subscription.delete(subscriptionId);
        if (!deleted) {
            return res.status(404).json({ message: 'Suscripción no encontrada' });
        }

        res.json({ message: 'Suscripción eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener suscripciones de un usuario
const getUserSubscriptions = async (req, res) => {
    const user_id = req.userId;

    try {
        const subscriptions = await Subscription.findByUserId(user_id);
        res.json(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Activar suscripción (Nueva función)
const activateSubscription = async (req, res) => {
    const { subscription_id } = req.body;

    try {
        await Subscription.update(subscription_id, {
            status: 'active',
            start_date: new Date(),
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });

        res.json({ 
            message: 'Suscripción activada correctamente',
            details: {
                start_date: new Date(),
                end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al activar la suscripción' });
    }
};

// Renovar suscripción (Nueva función)
const renewSubscription = async (req, res) => {
    const { subscription_id } = req.body;

    try {
        const subscription = await Subscription.findById(subscription_id);
        
        const newEndDate = new Date(subscription.end_date);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        await Subscription.update(subscription_id, {
            end_date: newEndDate
        });

        res.json({ 
            message: 'Suscripción renovada correctamente',
            new_end_date: newEndDate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al renovar la suscripción' });
    }
};

module.exports = { 
    createSubscription, 
    getSubscription, 
    updateSubscription, 
    deleteSubscription, 
    getUserSubscriptions,
    activateSubscription,
    renewSubscription
};