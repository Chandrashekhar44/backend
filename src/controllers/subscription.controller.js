import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscription.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async(req ,res)=>{
    const{channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"ChannelId is not found")
    }

   const checkSubscription = await Subscription.findOne({channel:channelId,
                                                         subscriber:req.user._id})

   if(checkSubscription){
    await checkSubscription.deleteOne()
    return res.status(200)
              .json(new ApiResponse(200,checkSubscription,"Unsubscribed successfully"))
   }

   const subscribing = await Subscription.create({channel:channelId,
                                                  subscriber:req.user._id
   })

   return res.status(200)
              .json(new ApiResponse(200,subscribing,"Subscribed successfully"))
})

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const{channelId} = req.params
    const{page=1,limit=20} = req.query

    if(!channelId){
        throw new ApiError(400,"ChannelId is not found")
    }
    const subscribersCount = await Subscription.countDocuments({channel:channelId})
   const subscribers = await Subscription.find({channel:channelId})
                                         .sort({createdAt : -1})
                                         .skip((Number(page) - 1)*Number(limit))
                                         .limit(Number(limit))
                                         .populate("subscriber","username email avatar")
   if(subscribers.length===0){
       return res.status(200).json(new ApiResponse(200,"NO subscribers yet"))
    }

     return res.status(200)
               .json(new ApiResponse(200,{subscribers,
                                          totalSubscribers:subscribersCount,
                                          totalpages:Math.ceil(subscribersCount/Number(limit)),
                                           currentPage:Number(page) 
                                        },"Fetched all the subscribers successfully"))
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const{subscriberId} = req.params
    const{page=1,limit=20} = req.query
    console.log(subscriberId)

    if(!subscriberId){
        throw new ApiError(400,"subscriberId is not found")
    }
    const channelsCount = await Subscription.countDocuments({subscriber:subscriberId})
   const channels = await Subscription.find({subscriber:subscriberId})
                                         .sort({createdAt : -1})
                                         .skip((Number(page) - 1)*Number(limit))
                                         .limit(Number(limit))
                                         .populate("channel","username email avatar")
   if(channels.length===0){
       return res.status(200).json(new ApiResponse(200,"No subscribed channels yet"))
    }

     return res.status(200)
               .json(new ApiResponse(200,{channels,
                                          totalChannels:channelsCount,
                                          totalPages:Math.ceil(channelsCount/Number(limit)),
                                           currentPage:Number(page) 
                                        },"Fetched all the channels successfully"))
})

export {toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers}