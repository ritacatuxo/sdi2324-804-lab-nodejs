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
            let favoriteSongs = await favoriteSongsCollection.find(filter, options).toArray();
            return favoriteSongs;
        } catch (error) {
            throw (error);
        }
    },
    insertFavoriteSong: async function (favoriteSong) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const result = await favoriteSongsCollection.insertOne(favoriteSong);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    deleteFavoriteSong: async function (filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const result = await favoriteSongsCollection.deleteOne(filter);
            return result.deletedCount;
        } catch (error) {
            throw (error);
        }
    }
};