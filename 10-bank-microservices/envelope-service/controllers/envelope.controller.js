const Envelope = require('../models/envelope')
const axios = require("axios");

//Crear un sobre
const createEnvelope = async (req, res) => {
  try {
    const { sobrenombre, sobremonto, sobreCuentaId } = req.body;
    const sobremontoNumber = parseFloat(sobremonto);
    console.log(req.body)

    //Tarea: Verificar que cuenta enviada exista en el microservicio de cuentas

    // Crear el sobre
    const envelope = await Envelope.create({
      sobrenombre,
      sobremonto,
      sobreCuentaId
    });

    res.status(201).json(envelope);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el sobre' });
  }
};

//Cargar dinero a un sobre
const loadToEnvelope = async (req, res) => {
  try {
    const { cuentaid, cantidadSobre, sobreid } = req.body;
    console.log(req.body);

    // Obtener el monto actual de la cuenta desde el microservicio
    const getAmountResponse = await axios.get(`${process.env.ACCOUNT_MICROSERVICE_URL}/summary/${cuentaid}`);
    const currentAmount = getAmountResponse.data.amount;
    console.log(currentAmount);

    // Obtener el monto actual del sobre
    const currentEnvelopeAmount = await getEnvelopeAmount(sobreid);
    console.log(currentEnvelopeAmount);

    // Realizar la operación matemática       
    const newAccountAmount = currentAmount - parseFloat(cantidadSobre); // Convertir a número decimal
    const newEnvelopeAmount = currentEnvelopeAmount + parseFloat(cantidadSobre); // Convertir a número decimal
    console.log(newAccountAmount, newEnvelopeAmount);

    // Actualizar el monto de la cuenta en el microservicio
    const updateAccountResponse = await axios.put(`${process.env.ACCOUNT_MICROSERVICE_URL}/${cuentaid}`, {
      cuentaid: cuentaid,
      amount: newAccountAmount
    });

    // Actualizar el monto del sobre en el microservicio de sobre
    const updateEnvelopeResponse = await updateEnvelopeAmount(sobreid, newEnvelopeAmount);

    // Envía la respuesta con el monto actualizado
    return res.status(200).json({
      message: "Amount loaded to envelope successfully",
      account: updateAccountResponse.data,
      envelope: updateEnvelopeResponse
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Actualizar monto del sobre
const updateEnvelopeAmount = async (sobreid, newAmount) => {
  try {
    // Busca el sobre por su ID
    const envelope = await Envelope.findOne({ where: { sobreid } });

    // Si no se encuentra el sobre, lanza un error
    if (!envelope) {
      throw new Error("Envelope not found");
    }

    // Actualiza el monto del sobre
    await envelope.update({ sobremonto: parseFloat(newAmount) }); // Convertir a número decimal

    return envelope;
  } catch (error) {
    throw new Error(`Error updating envelope amount: ${error.message}`);
  }
};

//Obtener monto actual del sobre
const getEnvelopeAmount = async (sobreid) => {
  try {
    // Busca el sobre por su ID
    const envelope = await Envelope.findOne({ where: { sobreid } });

    // Si no se encuentra el sobre, lanza un error
    if (!envelope) {
      throw new Error("Envelope not found");
    }

    return parseFloat(envelope.sobremonto);
  } catch (error) {
    throw new Error(`Error getting envelope amount: ${error.message}`);
  }
};

//Obtener todos los sobres de una cuenta
const getAllEnvelopes = async (req, res) => {
  try {
    const {sobreCuentaId } = req.params;
    // Busca los sobres de una cuenta
    const envelopes = await Envelope.findOne({ where: { sobreCuentaId } });

    // Si no se encuentra el sobre, lanza un error
    if (!envelopes) {
      throw new Error("Envelopes not found");
    }

    return res.status(200).json({
      envelopes: envelopes
    });
  } catch (error) {
    throw new Error(`Error getting envelopes: ${error.message}`);
  }
};

//Descargar dinero de un sobre
const loadToAccount = async (req, res) => {
  try {
    const { cuentaid, cantidadSobre, sobreid } = req.body;
    console.log(req.body);

    // Obtener el monto actual de la cuenta desde el microservicio
    const getAmountResponse = await axios.get(`${process.env.ACCOUNT_MICROSERVICE_URL}/summary/${cuentaid}`);
    const currentAmount = getAmountResponse.data.amount;
    console.log(currentAmount);

    // Obtener el monto actual del sobre
    const currentEnvelopeAmount = await getEnvelopeAmount(sobreid);
    console.log(currentEnvelopeAmount);

    if (parseFloat(currentEnvelopeAmount) < parseFloat(cantidadSobre)) {
      return res.status(400).json({
          error: "El monto a transferir excede el monto disponible del sobre."
      });
  }

    // Realizar la operación matemática       
    const newAccountAmount =parseFloat(currentAmount) + parseFloat(cantidadSobre); // Convertir a número decimal
    const newEnvelopeAmount = parseFloat(currentEnvelopeAmount) - parseFloat(cantidadSobre); // Convertir a número decimal
    console.log(newAccountAmount, newEnvelopeAmount);

    // Actualizar el monto de la cuenta en el microservicio
    const updateAccountResponse = await axios.put(`${process.env.ACCOUNT_MICROSERVICE_URL}/${cuentaid}`, {
      cuentaid: cuentaid,
      amount: newAccountAmount
    });

    // Actualizar el monto del sobre en el microservicio de sobre
    const updateEnvelopeResponse = await updateEnvelopeAmount(sobreid, newEnvelopeAmount);

    // Envía la respuesta con el monto actualizado
    return res.status(200).json({
      message: "Amount loaded to account successfully",
      account: updateAccountResponse.data,
      envelope: updateEnvelopeResponse
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//Eliminar un sobre
const deleteEnvelop = async (req, res) =>{
  try {
    const { cuentaid, sobreid } = req.body;
    console.log(req.body);

    // Obtener el monto actual de la cuenta desde el microservicio
    const getAmountResponse = await axios.get(`${process.env.ACCOUNT_MICROSERVICE_URL}/summary/${cuentaid}`);
    const currentAmount = getAmountResponse.data.amount;
    console.log(currentAmount);

    // Obtener el monto actual del sobre
    const currentEnvelopeAmount = await getEnvelopeAmount(sobreid);
    console.log(currentEnvelopeAmount);


    // Realizar la operación matemática       
    const newAccountAmount =parseFloat(currentAmount) + parseFloat(currentEnvelopeAmount); // Convertir a número decimal

    // Actualizar el monto de la cuenta en el microservicio
    const updateAccountResponse = await axios.put(`${process.env.ACCOUNT_MICROSERVICE_URL}/${cuentaid}`, {
      cuentaid: cuentaid,
      amount: newAccountAmount
    });

    const resultado = await Envelope.destroy({
      where: {
        sobreid: sobreid
      }
    });

    if (resultado === 0) {
      throw new Error('No se encontró ningún sobre con el ID proporcionado.');
    }

    return res.status(200).json({ message: 'Sobre eliminado exitosamente. El dinero fue transferido a la cuenta de origen',
      account: updateAccountResponse.data,
     });

    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



//Test

const testeo = async (req, res) => {
  console.log(req.body)
}


module.exports = {
  createEnvelope,
  testeo,
  loadToEnvelope,
  updateEnvelopeAmount,
  getAllEnvelopes,
  loadToAccount,
  deleteEnvelop

  // withdrawMoneyFromEnvelope,
  // deleteEnvelope
};