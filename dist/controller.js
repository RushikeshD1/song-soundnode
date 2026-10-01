import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { redisClient } from "./index.js";
export const getAllAlbums = TryCatch(async (req, res) => {
    let albums;
    const CACHE_EXPIRY = 1800; // half hour
    if (redisClient.isReady) {
        albums = await redisClient.get("albums");
    }
    if (albums) {
        console.log("Cache hit");
        res.json(JSON.parse(albums));
        return;
    }
    else {
        console.log("Cache miss");
        albums = await sql `SELECT * FROM albums`;
        if (redisClient.isReady) {
            await redisClient.set("albums", JSON.stringify(albums), {
                EX: CACHE_EXPIRY
            });
        }
        res.json(albums);
    }
});
export const getAllSongs = TryCatch(async (req, res) => {
    let songs;
    const CACHE_EXPIRY = 1800; // half hour
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
    }
    if (songs) {
        console.log("Cache hit");
        res.json(JSON.parse(songs));
        return;
    }
    else {
        console.log("Cache miss");
        songs = await sql `SELECT * FROM songs`;
        if (redisClient.isReady) {
            await redisClient.set("songs", JSON.stringify(songs), {
                EX: CACHE_EXPIRY
            });
        }
        res.json(songs);
    }
});
export const getAllSongsOfAlbums = TryCatch(async (req, res) => {
    const { id } = req.params;
    let albums, songs;
    const CACHE_EXPIRY = 1800; // half hour
    if (redisClient.isReady) {
        const cachedData = await redisClient.get(`album_songs_${id}`);
        if (cachedData) {
            console.log("Cache hit");
            res.json(JSON.parse(cachedData));
            return;
        }
    }
    console.log("Cache miss");
    albums = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (albums.length === 0) {
        res.status(404).json({
            message: "No album with this id"
        });
        return;
    }
    songs = await sql `SELECT * FROM songs WHERE album_id = ${id}`;
    const response = { songs, album: albums[0] };
    if (redisClient.isReady) {
        await redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
            EX: CACHE_EXPIRY
        });
    }
    res.json(response);
});
export const getSingleSong = TryCatch(async (req, res) => {
    const song = await sql `SELECT * FROM songs WHERE id = ${req.params.id}`;
    res.json(song[0]);
});
//# sourceMappingURL=controller.js.map