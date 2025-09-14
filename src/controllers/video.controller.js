import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

 const getAllVideos= asyncHandler(async(req,res)=>{
    const {page = 1,limit = 10, query,sortBy = "createdAt",sortType = "desc"} = req.query
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400,"UserId not found")
    }

   const options = {
    page :parseInt(page),
    limit:parseInt(limit),
    sort:{[sortBy]:sortType === "desc"? -1 :1}
   }

   const aggregateQuery = Video.aggregate(
    [
      { $match:
        {
        owner: new mongoose.Types.ObjectId(userId)
        }
      }
  ]
)

const videos =await Video.aggregatePaginate(aggregateQuery,options);

return res
         .status(200)
         .json(new ApiResponse(
          200,
         { success:true,
           totaldocs:videos.totalDocs,
           totalPages:videos.totalPages,
           currentPage:videos.page,
           videos:videos.docs},
           "All videos fetched Successfully"
         ))

  
 })
 const PublishAVideo = asyncHandler(async(req,res)=>{
     const {title,description,isPublished} = req.body

     if(!title || !description || !isPublished){
      throw  new ApiError(400,"Title and Description are required")
     }
     
      const filePath = req.files?.videoFile?.[0]?.path


      if(!filePath){
        throw new ApiError(400,"File path is not found")
      }

      const uploadFile = await uploadOnCloudinary(filePath)

      if(!uploadFile) {
        throw new ApiError(500,"problem in uploading a file")
      }

      const thumbnailPath = req.files?.thumbnail?.[0]?.path;

      if(!thumbnailPath){
        throw new ApiError(400,"Thumbnail Path not found")
      }
      const uploadThumbnail = await uploadOnCloudinary(thumbnailPath)
      
      if(!uploadThumbnail){
        throw new ApiError(400,"Problem in uploading a thumbnail ")
      }
      
      const video = await Video.create({
        owner:req.user._id,
        title,
        description,
        videoFile: uploadFile.secure_url,
        duration:uploadFile.duration || 0,
        isPublished:req.body.isPublished,
        thumbnail: uploadThumbnail.secure_url

      })


      return res
                .status(201)
                .json(new ApiResponse(
                  201,
                  video,
                  "Video uploaded successfully"
                ))
 })

 const getVideoById = asyncHandler(async(req,res)=>{
     const {videoId} = req.params 

     if(!videoId) {
      throw new ApiError(400,"VideoId not found")
     }

     const video = await Video.findById(videoId)
     if(!video ){
      throw new ApiError(404,"Video not found")
     }
      if(!video.isPublished ){
      throw new ApiError(404,"Video is private")
     }
     return res
            .status(200)
            .json(new ApiResponse(200,
              {video},
              "Video status fetched successfully")
            )

 })

 const updateVideo = asyncHandler(async(req,res)=>{
        const {videoId} = req.params
        const {title,description,isPublished} = req.body

        const videoAdmin = await Video.findById(videoId);
    if(!videoAdmin.owner.equals(req.user._id)){
              throw new ApiError(403,"You are not authorized to update the video")
    }

        if(!videoId){
          throw new ApiError(400,"videoID not found")
        } 

        const updatedFields ={ }

        if(title && title.trim()!== ""){
          updatedFields.title = title.trim()
        }

        if(description && description.trim()!==""){
          updatedFields.description = description.trim()
        }

        if(isPublished){
          updatedFields.isPublished = isPublished
        }
        const thumbnailPath = req.file?.path

        if(thumbnailPath){
            const thumbnailUrl = await uploadOnCloudinary(thumbnailPath) 
            if(!thumbnailUrl){
              throw new ApiError(500,"thumnailUrl is not found")
            }
            updatedFields.thumbnail = thumbnailUrl.secure_url
         }

         if(Object.keys(updatedFields).length===0){
          throw new ApiError(400,"Anyone one field needed to update the Video")
         }

        const video = await Video.findByIdAndUpdate(videoId,{
          $set:updatedFields},
         { new:true
        })

        if(!video){
          throw new ApiError(400,"Video is not found and not updated")
        }

       return res
                  .status(200)
                  .json(new ApiResponse(
                    200,
                    video,
                    "Video details updated successfully"
                  ))
  }
)

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    
    const video = await Video.findById(videoId);
    if(!video.owner.equals(req.user._id)){
              throw new ApiError(403,"You are not authorized to delete the video")
    }

    if(!videoId){
      throw new ApiError(
        400,"videoId not found"
      )
    }

   const result = await Video.findByIdAndDelete(videoId)
   if(!result){
    throw new ApiError(400,"videoId not found or video already deleted")
   }
   

  return res.status(200)
            .json(new ApiResponse(
              200,
              {result},"Video deleted Successfully"
            ))

})  

const togglePublishStatus =  asyncHandler(async(req,res)=>{
    const {videoId} = req.params

     const videoAdmin = await Video.findById(videoId);
    if(!videoAdmin.owner.equals(req.user._id)){
              throw new ApiError(403,"You are not authorized to change the toggle status(public or private) of the video")
    }

    
    if (!videoId){
      throw new ApiError(400,"videoId not found")
    }

   const video =  await Video.findById(videoId)
   if (!video){
    throw new ApiError(404,"video is not found")
   }

   video.isPublished = !video.isPublished
    await video.save()

    return res.status(200)
              .json(new ApiResponse(200,
                video,
                 `video is ${video.isPublished?"public":"private"}`))

 }


)

 const incrementView = asyncHandler(async(req,res)=>{
      const{videoId} = req.params
      const {watchedDuration} = req.body
      
      if (!videoId){
      throw new ApiError(400,"videoId not found")
    }
      
  
    const video = await Video.findById(videoId)

     if (!video){
      throw new ApiError(404,"video not found")
    }

    if(watchedDuration >= video.duration / 2){
      video.views+=1
      await video.save()

       return res.status(200)
              .json(new ApiResponse(200,video.views,"View increased by 1"))
    }else{
      return res.status(200)
              .json(new ApiResponse(200,video.views,"Not enough watched to count view"))}
  }
 )

export {
  getAllVideos,
  PublishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  incrementView
}
