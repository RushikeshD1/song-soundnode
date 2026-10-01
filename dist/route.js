import express from "express";
import { getAllAlbums, getAllSongs, getAllSongsOfAlbums, getSingleSong } from "./controller.js";
const router = express.Router();
router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbums);
router.get("/song/:id", getSingleSong);
export default router;
//# sourceMappingURL=route.js.map