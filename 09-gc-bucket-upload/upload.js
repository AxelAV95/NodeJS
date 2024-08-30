const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

// Ruta al archivo de credenciales JSON
const keyFilename = './credentials.json';

// Crea una instancia de Storage con las credenciales
const storage = new Storage({ keyFilename });

// Nombre del bucket y ruta de la imagen local
const bucketName = 'test';
const fileName = './pastelillo.jpeg';
const destination = '/pastelillo.jpeg';

async function uploadFile() {
  try {
    // Sube el archivo
    await storage.bucket(bucketName).upload(fileName, {
      destination: destination,
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

uploadFile();