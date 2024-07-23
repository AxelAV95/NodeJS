//npm install mongodb
//npm install 
//npm i dotenv
//npm i openai
//npm i express-async-errors
require("express-async-errors")

const express = require("express")

const addManga = require("./controllers/addManga")
const getAllMangas = require("./controllers/getAllMangas")
const getSingleManga = require("./controllers/getSingleManga")
const getMangasByChapter = require("./controllers/getMangasByChapter")

const mongoose = require('mongoose')
const editManga = require("./controllers/editManga")
const deleteManga = require("./controllers/deleteManga")
const getMangasByDate = require("./controllers/getMangaByDate")
const errorHandler = require("./handlers/errorHandler")
// const getMangaRecommendation = require("./controllers/getMangaRecommendation")

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
app.get("/api/mangas/chapters/:chapters", getMangasByChapter)
app.get("/api/mangas/date/:startYear/:endYear", getMangasByDate)


app.use(errorHandler)
// app.get("/api/mangas/openai/recomendations", getMangaRecommendation)
app.listen(process.env.PORT, ()=>{
    console.log("Server running...")
})