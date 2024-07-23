const fs = require("fs");
const jsonChecker = require("./jsonChecker");

const getMovies = (req, res) => {
  fs.readFile("./movies.json", "utf-8", (err, data) => {
    // If reading fails
    if (err) {
      res.status(400).json({
        status: "failed",
        message: "Could not read file!",
      });

      return;
    }
    // If reading is successfull...

    if (!jsonChecker(data)) {
      res.status(400).json({
        status: "failed",
        message:
          "JSON data in movies.json file is not formatted correctly. If you are unsure of what error that is, keep empty array in that file!",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: JSON.parse(data),
    });
  });
};

module.exports = getMovies;
