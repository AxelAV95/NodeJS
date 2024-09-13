const express = require("express")
const cors = require("cors")
const port = process.env.PORT_A || 5001
const sequelize = require('./db');
//npm install axios


const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello from the account server")
})

app.use("/api/account", require("./routes/account.routes"))

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

