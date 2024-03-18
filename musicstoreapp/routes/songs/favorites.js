const {ObjectId} = require("mongodb");
module.exports = function(app, favoriteSongsRepository, songsRepository) {


    app.get("/songs/favorites", function(req, res) {


        let filter = {};
        let options = {sort: { title: 1}};
        if(req.query.search != null && typeof(req.query.search) != "undefined" && req.query.search != ""){
            filter = {"title": {$regex: ".*" + req.query.search + ".*"}};
        }

        favoriteSongsRepository.getFavoriteSongs(filter, options).then(favorites => {
            res.render("favorites/favorites.twig", {songs: favorites});
        }).catch(error =>{
            res.send("Se ha producido un error al listar las canciones " + error)
        });
    });


    app.post('/songs/favorites/add/:song_id', async function (req, res) {

        // conectar al repo de songs, recuperar, extraer valores que necesitas
        let filter = {_id: new ObjectId(req.params.song_id)};
        let options = {};
        let song = await songsRepository.findSong(filter, options); // esperar a que llegue la song (await) porq son asincronas

        if(song == null)
            console.log("song es null");
;
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
        res.render("favorites/favorites.twig", {favorites: await favoriteSongsRepository.getFavoriteSongs(filter, options)});
    });


}