const mongoose = require("mongoose");

const getMangasByDate = async (req, res) => {
    const mangaModel = mongoose.model("mangas");
    const { startYear, endYear } = req.params;

    // Validar que los parámetros están presentes y son números
    if (!startYear || !endYear || isNaN(startYear) || isNaN(endYear)) {
        return res.status(400).json({
            status: "failed",
            message: "Both startYear and endYear are required and must be valid numbers."
        });
    }

    try {
        // Convertir parámetros a enteros
        const start = parseInt(startYear, 10);
        const end = parseInt(endYear, 10);

        // Filtrar mangas por el rango de años dados
        const mangas = await mangaModel.find({
            year: {
                $gte: start, // Año de inicio (inclusive)
                $lte: end    // Año de fin (inclusive)
            }
        });

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

module.exports = getMangasByDate;
