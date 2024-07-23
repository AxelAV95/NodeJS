const express = require("express");
const addMovie = require("./controllers/addMovie");
const editMovie = require("./controllers/editMovie");
const deleteMovie = require("./controllers/deleteMovie");
const getSingleMovie = require("./controllers/getSingleMovie");
const getMovies = require("./controllers/getMovies");
const mainPage = require("./controllers/mainpage");

const app = express();

app.use(express.json());

// Main page Routes....
app.get("/", mainPage);

// API routes...
app.post("/api/movies", addMovie);
app.get("/api/movies", getMovies);
app.patch("/api/movies", editMovie);
app.delete("/api/movies/:movie_id", deleteMovie);

app.get("/api/movies/:movie_id", getSingleMovie);

// Starting the server

app.listen(4000, () => {
  console.log("Server started successfully!");
});
