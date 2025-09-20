import cors from "cors"
import cookieparser from "cookie-parser"
import express from "express"
import errorHandler from "./middlewares/errorHandler.middleware.js"


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())

import userRouter from "./routes/user.route.js"
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import playlistRouter from "./routes/playlist.route.js"
import videoRouter from "./routes/video.route.js"

app.get("/", (req, res) => {
  res.send({
    message: "🚀 Blog Auth API is running! All endpoints are live.",
    endpoints: {
      users: "/api/v1/users",
      tweets: "/api/v1/tweets",
      comments: "/api/v1/comments",
      likes: "/api/v1/likes",
      subscriptions: "/api/v1/subscriptions",
      dashboards: "/api/v1/dashboards",
      playlists: "/api/v1/playlists",
      videos: "/api/v1/videos"
    }
  });
});

app.use("/api/v1/users",userRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/dashboards",dashboardRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/videos",videoRouter)

app.use(errorHandler)


export {app}