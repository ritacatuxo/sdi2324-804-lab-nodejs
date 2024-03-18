module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "favorite_songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getFavoriteSongs: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const favoriteSongs = await favoriteSongsCollection.find(filter, options).toArray();
            return favoriteSongs;
        } catch (error) {
            throw (error);
        }
    },
    findFavoriteSong: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const favoriteSong = await favoriteSongsCollection.findOne(filter, options);
            return favoriteSong;
        } catch (error) {
            throw (error);
        }
    }, insertFavoriteSong: async function (favoriteSong) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const result = await favoriteSongsCollection.insertOne(favoriteSong);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    }
};