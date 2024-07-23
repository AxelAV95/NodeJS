const mongoose = require("mongoose");

const getSingleManga = async (req, res) => {
    try {
        const mangaModel = mongoose.model("mangas");
        const mangaId = req.params.id;
        const mangaObjectId = new mongoose.Types.ObjectId(mangaId);


        const mangasData = await mangaModel.aggregate([
            {
                $match: {
                    _id: mangaObjectId
                }
            },
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

module.exports = getSingleManga;