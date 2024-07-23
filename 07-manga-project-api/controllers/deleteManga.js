const mongoose = require('mongoose');

const deleteManga = async (req, res) => {
    const mangaModel = mongoose.model('mangas');
    const mangaId = req.params.id;

    try {
        // Verificar si el manga existe
        const manga = await mangaModel.findById(mangaId);
        
        if (!manga) {
            return res.status(404).json({
                status: 'failed',
                message: 'This manga does not exist'
            });
        }

        // Eliminar el manga
        await mangaModel.deleteOne({ _id: mangaId });

        res.status(200).json({
            status: 'success',
            message: 'Manga deleted successfully'
        });
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
};

module.exports = deleteManga;
