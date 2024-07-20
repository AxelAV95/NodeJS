//npm init
//npm install express --save

const express = require('express')
const app = express()

app.get("/", (req,res)=>{
    res.send("Hello from the express server")
})

app.get("/mangas", (req,res) =>{
    res.send("These are mangas")
})

app.listen(8000,()=>{
    console.log("Express server running...")
})