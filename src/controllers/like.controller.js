import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const{videoId} = req.params

    if(!videoId){
        throw new ApiError(400,"VideoId not found")
    }
     
   const toggleStatusCheck =  await Like.findOne({video:videoId,likedBy:req.user._id})
    
   if(toggleStatusCheck){
      await toggleStatusCheck.deleteOne()
      return res.status(200)
                .json(new ApiResponse(200,toggleStatusCheck,"Unliked successfully"))
   }

   const likedData = await Like.create({video:videoId,likedBy:req.user._id})

   if(!likedData){
    throw new ApiError(400,"something went wrong while liking")
   }
   return res.status(200)
             .json(new ApiResponse(200,likedData,"Liked successfully"))
  
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const{commentId} = req.params

    if(!commentId){
        throw new ApiError(400,"commentId not found")
    }
     
   const toggleStatusCheck =  await Like.findOne({comment:commentId,likedBy:req.user._id})
    
   if(toggleStatusCheck){
       await toggleStatusCheck.deleteOne()
      return res.status(200)
                .json(new ApiResponse(200,toggleStatusCheck,"Unliked successfully"))
   }
     const likedData = await Like.create({comment:commentId,likedBy:req.user._id})

     if(!likedData){
        throw new ApiError(400,"Something went wrong ")
     }
             return res.status(200)
             .json(new ApiResponse(200,likedData,"Liked successfully"))
  
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const{tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400,"tweetId not found")
    }
     
   const toggleStatusCheck =  await Like.findOne({tweet:tweetId,likedBy:req.user._id})
    
   if(toggleStatusCheck){
      await toggleStatusCheck.deleteOne()
      return res.status(200)
                .json(new ApiResponse(200,"Unliked successfully"))
   }

   const likedData =await Like.create({tweet:tweetId,likedBy:req.user._id})
   if(!likedData){
    throw new ApiError(400,"something went wrong")
   }
   return res.status(200)
             .json(new ApiResponse(200,"Liked successfully"))
  
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id

  const likedVideos=  await Like.find({likedBy:userId,video:{$ne:null}}).populate("video")

  if(!likedVideos || likedVideos.length===0){
    return res.status(200)
              .json(new ApiResponse(200,[],"No liked Videos found"))
  }

  return res.status(200)
              .json(new ApiResponse(200,
                likedVideos.map(like => like.video)
                ,"Fetched all the liked videos"))
})

export{
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}