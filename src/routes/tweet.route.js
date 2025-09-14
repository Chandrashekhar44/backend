import { Router } from "express";
import { addTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}  from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT);

router.route("/").post(addTweet)
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet) 

export default router