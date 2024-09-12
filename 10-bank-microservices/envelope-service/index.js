//npm install sequelize mysql2 express dotenv cors bcrypt jsonwebtoken express-validator express 

const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 5000
const sequelize = require('./db');


const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello from the envelope server")
})

app.use("/api/envelope", require("./routes/envelope.routes"))

app.listen(process.env.PORT, () => {
    console.log("Express server running...")
})

// Probar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

