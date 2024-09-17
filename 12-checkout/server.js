//npm install express body-parser cors multer nodemailer
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configuración de Nodemailer para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL
  }
});

// Ruta para manejar la subida del comprobante de pago
app.post('/upload-receipt', upload.single('receipt'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const mailOptions = {
    from: 'email',
    to: 'email',
    subject: 'Nuevo Comprobante de Pago',
    text: 'Se ha subido un nuevo comprobante de pago.',
    attachments: [
      {
        filename: req.file.filename,
        path: req.file.path
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Receipt uploaded and email sent.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});