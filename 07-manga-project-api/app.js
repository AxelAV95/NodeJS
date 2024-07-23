//npm install mongodb
//npm install 
//npm i dotenv
const express = require("express")
const addManga = require("./controllers/addManga")
const getAllMangas = require("./controllers/getAllMangas")
const getSingleManga = require("./controllers/getSingleManga")
const getMangasByChapter = require("./controllers/getMangasByChapter")

const mongoose = require('mongoose')
const editManga = require("./controllers/editManga")
const deleteManga = require("./controllers/deleteManga")

require("dotenv").config()
 

//connection
mongoose.connect(process.env.mongo, {}).then(()=>{
    console.log("Mongo Cloud connection successful")
}).catch(()=>{
    console.log("Error")
})
const app = express()

app.use(express.json())

app.post("/api/mangas", addManga)
app.get("/api/mangas", getAllMangas)
app.get("/api/mangas/:id", getSingleManga)
app.patch("/api/mangas", editManga)
app.delete("/api/mangas/:id", deleteManga)

app.listen(process.env.PORT, ()=>{
    console.log("Server running...")
})