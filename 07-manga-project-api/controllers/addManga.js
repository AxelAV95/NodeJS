
const mongoose = require('mongoose')
// const mangaModel = require('../models/manga.model');


const addManga = async (req, res) => {
    const mangaModel = mongoose.model("mangas")
    const { title, author, year, chapters, categories } = req.body


    try {

        //validations
        // if (!title) throw "Title must be provided"
        // if (!author) throw "Author must be provided"
        // if (!year) throw "Year must be provided"
        // if (!chapters) throw "Chapters must be provided"
        // if (!categories || !Array.isArray(categories) || categories.length === 0) throw "Categories must be provided";


    } catch (e) {
        res.status(400).json({
            status: "failed",
            message: e
        });
        return
    }

    //success
    try {

        const createdManga = await mangaModel.create({
            title: title,
            author: author,
            year: year,
            chapters: chapters,
            categories: categories
        })
    } catch (e) {
        res.status(400).json({
            status: "failed",
            message: e.message
        });
        return
    }


    res.status(200).json({
        status: "success",
        message: "Manga added successfully"
    })
}

module.exports = addManga