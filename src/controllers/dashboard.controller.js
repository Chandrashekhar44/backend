import { ApiError } from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Like} from "../models/like.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.models.js"
import { Tweet } from "../models/tweet.model.js"
import mongoose, { Mongoose } from "mongoose"

const getChannelStats = asyncHandler(async(req ,res)=>{
   const{userId} = req.user._id

    // if(!userId){
    //     throw new ApiError(400,"UserId not found")
    // }

  
   const totalVideos =  await Video.countDocuments({owner:userId})
    const totalTweets =  await Tweet.countDocuments({owner:userId})

    const totalLikes = await Like.aggregate([{
       $lookup:{
           from:"videos",
           localField:"video",
           foreignField:"_id",
           as:"videoData"
       }
    },{
        $unwind:"$videoData"
    },{$match:{
        "videoData.owner":new mongoose.Types.ObjectId(userId)
    }},{$count:"totalLikes"}
])
  

    return res.status(200)
            .json(new ApiResponse(200,{totalLikes,totalTweets,totalVideos},"Fetched total data successfully"))
})

const getChannelVideos = asyncHandler(async(req,res)=>{
      const userId = req.user._id

       if(!userId){
        throw new ApiError(400,"UserId not found")
       }
     const allVideos = await Video.aggregate([{
        $match:{owner: new mongoose.Types.ObjectId(userId)}
     },{
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"uploadedVideos"
        }
     },{
        $unwind:"$uploadedVideos"
     }])

     return res.status(200)
               .json(new ApiResponse(200,allVideos,"Fetched all the videos successfully"))
})

export {getChannelStats,
    getChannelVideos
}