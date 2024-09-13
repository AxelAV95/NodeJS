//Paquetes
//npm install sequelize mysql2
//npm install express --save
//npm install express dotenv
//npm install cors
//npm install -D nodemon
//npm install bcrypt jsonwebtoken express-validator
//---------------------------------------------
// Docker
//docker build -t user-service .
//docker run -p 3000:3000 --env-file .env user-service
//docker exec -it user-service-container env

//Docker compose
//docker-compose up --build
//docker-compose up -d
//docker-compose down
/**
 * --volumes: Elimina los volúmenes creados por los servicios.
--rmi all: Elimina las imágenes construidas.
docker-compose stop
docker-compose start
docker-compose ps
docker-compose logs
docker-compose logs -f  # Para logs en tiempo real
docker-compose exec <service_name> <command>
docker-compose exec web bash
docker-compose build
docker-compose restart
docker-compose config
docker-compose rm
docker-compose pull


 */

const sequelize = require('./db');
const express = require("express")
const cors = require("cors")
const port = process.env.PORT_U || 5000

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello from the express server")
})

app.use("/api/user", require("./routes/user.routes"))

app.listen(port, () => {
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


