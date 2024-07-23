const mongoose = require("mongoose");

const getMangasByChapter = async (req, res) => {
    const mangaModel = mongoose.model("mangas");
    const { chapters } = req.params
    console.log(chapters)
    try {
        // Encuentra mangas con más de 1000 capítulos
        const mangas = await mangaModel.find({ chapters: { $gt: chapters } });

        res.status(200).json({
            status: "success",
            data: mangas
        });
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        });
    }
};

module.exports = getMangasByChapter;
