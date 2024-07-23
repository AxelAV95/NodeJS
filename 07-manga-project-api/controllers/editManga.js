const mongoose = require('mongoose')
const mangaModel = require('../models/manga.model');

const editManga = async (req, res) => {
    const mangaModel = mongoose.model("mangas")
    const { id, title, author, year, chapters, categories } = req.body

    // res.status(200).json({
    //     data: req.body
    // })

    try {
        if (!id) throw "Manga ID is required"
    } catch (e) {
        res.status(400).json({
            status: "failed",
            message: e
        });
        return
    }
    try {



        await mangaModel.updateOne(
            {
                _id: id
            },
            {
                title: title,
                author: author,
                year: year,
                chapters: chapters,
                categories: categories
            },
            {
                runValidators: true
            }
        )
    } catch (e) {
        res.status(400).json({
            status: "failed",
            message: e.message
        });
        return
    }

    res.status(200).json({
        status: "success",
        message: "Manga updated successfully"
    })


}

module.exports = editManga