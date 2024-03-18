const {ObjectId} = require("mongodb");
module.exports = function(app, favoriteSongsRepository, songsRepository) {


    app.get("/songs/favorites", async function(req, res) {

        let filter = {}
        let options = {};
        let favorites = await favoriteSongsRepository.getFavoriteSongs(filter, options);

        // precio total de la lista de favoritos
        let totalPrice = favorites.reduce((total, favorite) => total + favorite.price, 0);
        /*let totalPrice = 0;
        favorites.forEach(favorite => {
            totalPrice += favorite.price;
        });*/

        res.render("favorites/favorites.twig", {
            favorites: favorites,
            totalPrice: totalPrice
        });
    });


    app.post('/songs/favorites/add/:song_id', async function (req, res) {

        // conectar al repo de songs, recuperar, extraer valores que necesitas
        let filter = {_id: new ObjectId(req.params.song_id)};
        let options = {};
        let song = await songsRepository.findSong(filter, options); // esperar a que llegue la song (await) porq son asincronas

        if(song == null)
            console.log("song es null");

        let favoriteSong = {
            song_id: new ObjectId(song._id),
            date: Date.now(),
            price: parseInt(song.price),
            title: song.title,
            author: req.session.user
            // _id: es generada automáticamente por MongoDB
        }

        await favoriteSongsRepository.insertFavoriteSong(favoriteSong);

        filter = {}
        options = {};
        let favorites = await favoriteSongsRepository.getFavoriteSongs(filter, options);
        // precio total de la lista de favoritos
        let totalPrice = favorites.reduce((total, favorite) => total + favorite.price, 0);


        res.render("favorites/favorites.twig", {
            favorites: await favoriteSongsRepository.getFavoriteSongs(filter, options),
            totalPrice: totalPrice
        });
    });

    app.get('/songs/favorites/delete/:song_id', async function (req, res) {

        // conectar al repo de songs, recuperar, extraer valores que necesitas
        let filter = {_id: new ObjectId(req.params.song_id)};
        let deletedCount = await favoriteSongsRepository.deleteFavoriteSong(filter);

        if(deletedCount===1){
            res.send("canción eliminada de favoritos");
        } else {
            res.send("La canción no se eliminó de favoritos");
        }
    });


}