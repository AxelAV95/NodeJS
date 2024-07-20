//npm i nodemon

const express = require('express')
const fs = require('fs')
const app = express()

app.get("/", (req,res)=>{
    res.send("Hi from the express server!!")
})

app.get("/mangas", (req,res) =>{
    fs.readFile('./data.txt', 'utf-8',(err,data) =>{
        if(err) res.send("There was an error accessing the file")
        res.send(data)
    })
    
})

app.get("/save", (req,res)=>{
    fs.appendFile('./data.txt', "\nShingeki no kyojin", (err) =>{
        if(err) res.send("Error writing to file")
        res.send("Data saved successfully")
    })
})

app.listen(8000,()=>{
    console.log("Express server running...")
})