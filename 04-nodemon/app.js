//npm i nodemon

const express = require('express')
const app = express()

app.get("/", (req,res)=>{
    res.send("Hi from the express server!!")
})

app.get("/mangas", (req,res) =>{
    res.send("These are mangas!!!")
})

app.listen(8000,()=>{
    console.log("Express server running...")
})