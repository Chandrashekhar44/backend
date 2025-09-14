import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const addComment = asyncHandler(async(req ,res)=>{
    const{videoId} = req.params
    const{content} = req.body

    if(!videoId){
         throw new ApiError(400,"VideoId not found")
    }

    if(!content && content.trim()===""){
        throw new ApiError(400,"Comment content is required")
    }
    
   const createdComment= await Comment.create({content,video :videoId,owner :req.user._id})

   if(!createdComment){
    throw new ApiError(400,"Something went wrong while adding the comment")
   }

   return res.status (201)
             .json(new ApiResponse(201,createdComment,"Comment added successfully"))
  

})

const updateComment = asyncHandler(async(req,res)=>{
    const{commentId} = req.params
    const{content} = req.body

    if(!commentId){
        throw new ApiError(400,"CommentId is not found")
    }

    if(!content || content.trim()===""){
        throw new ApiError(400,"Comment content is required")
    }


    const updatedComment = await Comment.findOneAndUpdate(
        {_id :commentId,owner:req.user._id},
        {content},
        {new:true}
    )

    if(!updatedComment){
        throw new ApiError(400,"Something went wrong while Updating the comment")
    }
    
     return res.status (200)
             .json(new ApiResponse(200,updatedComment,"Comment updated successfully"))

})

const deleteComment = asyncHandler(async(req,res)=>{
    const{commentId} = req.params

    if(!commentId){
        throw new ApiError(400,"CommentId is not found")
    }

   const deletedComment = await Comment.findOneAndDelete({_id :commentId,owner:req.user._id},)
   if(!deletedComment){
    throw new ApiError(404,"Allready deletd or comment not found")
   }

    return res.status (200)
             .json(new ApiResponse(200,deletedComment,"Comment deleted successfully"))

})

const getVideoComments = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {page =1 ,limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400,"VideoId not found")
    }
    const allComments = await Comment.countDocuments({video:videoId})

   const comments = await Comment
                                         .find({video:videoId})
                                         .populate("owner","username avatar")
                                         .sort({createdAt: -1})
                                         .skip((Number(page) -1) * Number(limit))
                                         .limit(Number(limit))

   
   return res.status(200)
            .json(new ApiResponse(200,
                      {comments,
                        allComments,
                        totalPages:Math.ceil(Number(allComments)/Number(limit)),
                        currentPage:Number(page)
                      }
                                 ,"Fetched all Comments successfully"))
})


export {addComment,
    updateComment,
    deleteComment,
    getVideoComments
}