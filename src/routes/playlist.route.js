import { Router } from "express";
import {createPlaylist,
    updatePlaylist,
    getPlaylistById,
    getUserPlaylists,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist}  from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()
router.use(verifyJWT)

router.route("/").post(createPlaylist)

router
       .route("/:playlistId")
       .get(getPlaylistById)
       .patch(updatePlaylist)
       .delete(deletePlaylist)


router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/delete/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/user/:userId").get(getUserPlaylists)

export default router

          