const mongoose = require("mongoose");

const getAllMangas = async (req, res) => {
  try {
    const mangaModel = mongoose.model("mangas");

    const mangasData = await mangaModel.aggregate([
      {
        $lookup: {
          from: "categories", // Colección con la que se quiere hacer join
          localField: "categories", // Campo en la colección mangas
          foreignField: "_id", // Campo en la colección categories
          as: "categoryDetails" // Nombre del campo para los resultados del join
        }
      },
      {
        $project: {
          title: 1,
          author: 1,
          year: 1,
          chapters: 1,
          categories: {
            $map: {
              input: "$categoryDetails",
              as: "category",
              in: {
                _id: "$$category._id",
                name: "$$category.name"
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      data: mangasData
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving mangas",
      error: error.message
    });
  }
};

module.exports = getAllMangas;


/*

db.mangas.aggregate([
  {
    $lookup: {
      from: "categories", // Colección con la que se quiere hacer join
      localField: "categories", // Campo en la colección mangas
      foreignField: "_id", // Campo en la colección categories
      as: "categoryDetails" // Nombre del campo para los resultados del join
    }
  },
  {
    $project: {
      title: 1,
      author: 1,
      year: 1,
      chapters: 1,
      categories: {
        $map: {
          input: "$categoryDetails",
          as: "category",
          in: {
            _id: "$$category._id",
            name: "$$category.name"
          }
        }
      }
    }
  }
])


*/