const fs = require("fs");
const jsonChecker = require("./jsonChecker");

const getSingleMovie = (req, res) => {
  const { movie_id } = req.params;

  try {
    if (!movie_id) throw "Movies id is required";
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e,
    });
    return;
  }

  let allMovies = [];
  let singleMovie = [];

  fs.readFile("./movies.json", "utf-8", (err, data) => {
    // If reading fails
    if (err) {
      res.status(400).json({
        status: "failed",
        message: "Could not read file!",
      });

      return;
    }

    // We are trying to parse the JSON and if error occours, we will throw error here itself so that below lies do not crash our server.

    if (!jsonChecker(data)) {
      res.status(400).json({
        status: "failed",
        message:
          "JSON data in movies.json file is not formatted correctly. If you are unsure of what error that is, keep empty array in that file!",
      });
      return;
    }

    allMovies = JSON.parse(data);

    singleMovie = allMovies.filter(
      (movie) => movie.id && movie.id.toString() === movie_id.toString()
    );

    res.status(200).json({
      status: "success",
      data: singleMovie,
    });
  });
};

module.exports = getSingleMovie;
