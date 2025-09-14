import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";

const addTweet = asyncHandler(async(req ,res)=>{
    const {content} = req.body

   if (!content || content.trim===""){
    throw new ApiError(400,"Content not found")
   }
    
   const tweet = await Tweet.create({
    content,
    owner:req.user?._id
   })

return res.status(201)
          .json(new ApiResponse(201,tweet,"Tweet created successfully"))

    
})

const getUserTweets = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    const {
        sortBy = "createdAt",
        order = "desc",
        limit = 10,
        page = 1
    } = req.query;

    if(!userId){
        throw new ApiError(400,"userId not found")
    }

    const tweets = await Tweet.aggregate([
        {$match:{owner:new mongoose.Types.ObjectId(userId)}},
        {$sort:{[sortBy]:order==="asc" ? 1 : -1 } },
        {$skip:(page-1)*parseInt(limit)},
        {$limit:parseInt(limit)},
        {$lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"user"
        }},{
            $unwind:"$user"
        },
        {
            $project:{
                content:1,
                createdAt:1,
              "user.username":1,
              "user.email":1
            }
        }
    ])
    return res.status(200)
              .json(new ApiResponse(200,tweets,"Successfully fetched all the tweets"))

})

const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    const {content} = req.body
 
   
    if(!tweetId){
        throw new ApiError(400,"tweetId not found")
    }

     const tweet =await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(400,"Tweet is not found or deleted")
    }
    if(!tweet?.owner?.equals(req.user._id)){
        throw new ApiError(403,"You are not authorized to update this Tweet")
    }
  const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
    $set:{
        content : content
    }
   },{new:true,returnDocument : "after"})

   if(!updatedTweet){
    throw new ApiError(400,"Tweet not found or update failed")
   }
   console.log(updatedTweet)

    return res.status(200)
           .json(new ApiResponse(200,updatedTweet.toObject(),"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params

     const tweet = await Tweet.findById(tweetId);
    
      if(!tweet){
        throw new ApiError(400,"Tweet is not found or already deleted")
      }

    if(!tweet.owner.equals(req.user._id)){
        throw new ApiError(403,"You are not authorized to delete this Tweet")
    }

    if(!tweetId){
        throw new ApiError(400,"TweetId not found")
    }

   const deletedTweet= await Tweet.findByIdAndDelete(tweetId)
   if(!deletedTweet){
    throw new ApiError(400,"Tweet not found or deleted already")
   }
   
   return res.status(200)
             .json(new ApiResponse(200,deletedTweet,"Tweet deleted successfully"))
})

export {
    addTweet,
    getUserTweets,
    updateTweet,
    deleteTweet

}