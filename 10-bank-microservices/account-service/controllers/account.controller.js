const Account = require("../models/account");
const axios = require("axios");

const account = async (req, res) => {
    try {
        // Busca el usuario con Sequelize, que usa 'where' para condiciones
        const user = await Account.findOne({ where: { cuentaUsuarioId: req.params.userId } });

        // Si no se encuentra el usuario, devuelve un mensaje de error
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }

        // Extrae el token de autorización del encabezado de la solicitud actual
        const authToken = req.headers.authorization;
        // console.log(authToken);

        if (!authToken) {
            return res.status(401).json({ message: "Authorization token is required" });
        }

        // Realiza la solicitud al otro microservicio para obtener los datos del usuario
        const userId = req.params.userId;

        try {
            const userResponse = await axios.get(
                `${process.env.USER_MICROSERVICE_URL}/account/${userId}`,  // URL del microservicio con userId como parámetro de consulta
                {
                    headers: {
                        'Authorization': authToken         // Token de autorización en los encabezados
                    }
                }
            );

            // Verifica si la solicitud al microservicio fue exitosa
            if (userResponse.status !== 200) {
                return res.status(404).json({ message: "User data not found in external service" });
            }

            const userData = userResponse.data;

            // Combina los datos locales con los datos del microservicio
            const combinedData = {
                account: user.dataValues, // Datos locales de la cuenta
                user: userData            // Datos del usuario del microservicio
            };

            // Envía la respuesta con los datos combinados
            return res.status(200).json(combinedData);
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de estado diferente de 2xx
                return res.status(error.response.status).json({ message: error.response.data.message || "Error fetching user data from external service" });
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                return res.status(500).json({ message: "No response received from external service" });
            } else {
                // Algo sucedió en la configuración de la solicitud que provocó un error
                return res.status(500).json({ message: error.message });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getAccountAmount = async (req, res) => {
    try {
        const { cuentaid } = req.params; // Asegúrate de que el ID de la cuenta se pasa como parámetro en la URL

        // Busca la cuenta por su ID
        const account = await Account.findOne({ where: { cuentaid } });

        // Si no se encuentra la cuenta, devuelve un mensaje de error
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Extrae el monto actual de la cuenta
        const currentAmount = account.cuentaMonto;

        // Envía la respuesta con el monto actual
        return res.status(200).json({ message: "Current amount retrieved successfully", amount: currentAmount });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const updateAccountAmount = async (req, res) => {
    try {
        
        const { cuentaid, amount } = req.body;

        // Busca la cuenta por su ID
        const account = await Account.findOne({ where: { cuentaid } });

        // Si no se encuentra la cuenta, devuelve un mensaje de error
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Actualiza el monto de la cuenta
        await account.update({ cuentaMonto: amount });

        // Envía la respuesta con el monto actualizado
        return res.status(200).json({ message: "Amount updated successfully", account });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//Transferir dinero


module.exports = { account, getAccountAmount,updateAccountAmount };