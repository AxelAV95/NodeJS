const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Title must be provided"] },
    author: { type: String, required: [true , "Author must be provided"]},
    year: { type: Number, required: [true,"Year must be provided"] },
    chapters: { type: Number, required: [true,"Chapters must be provided"] },
    categories: { 
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
        validate: {
            validator: function(value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "Categories must be provided and cannot be empty"
        }
    }
    // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }]
});

const mangasModel = mongoose.model('mangas', mangaSchema);

module.exports = mangasModel;
