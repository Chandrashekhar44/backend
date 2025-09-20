
import {Playlist} from "../models/playlist.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const createPlaylist = asyncHandler(async(req,res)=>{
       const {name,description} = req.body

       if(!name||!description){
        throw new ApiError(400,"Name and description both required")
       }
       
       const createdPlaylist = await Playlist.create({
        name,
        description,
        owner:req.user?._id
       })

       if(!createdPlaylist){
        throw new ApiError(400,"Something went wrong while creating the playlist")
       }

       return res.status(201)
                 .json(new ApiResponse(201,createdPlaylist,"Playlist created sucessfully"))

})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }
    

    if(!playlist.owner.equals(req.user._id)){
           throw new ApiError(403,"You are not the playlist owner to add the song")
    }
    
    if(!playlistId||!videoId){
        throw new ApiError(400,"playlistId or videoId is missing")
    }

   const videoAdded = await Playlist.findByIdAndUpdate(playlistId,
        {$addToSet:{
            videos : videoId
        }},{
            new:true
        }
    )
    
    if(!videoAdded){
        throw new ApiError(400,"Playlist not found")
    }

    return res.status(200)
              .json(new ApiResponse(200,videoAdded,"Video added to playlist successfully"))
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
        const{userId} = req.params

        if(!userId){
            throw new ApiError(400,"userId is not found")
        }

      const userPlaylists = await Playlist.find({owner:userId})
      if(!userPlaylists){
        throw new ApiError(404,"User not found")
      }

      if(userPlaylists.length === 0){
        throw new ApiError(404,"No user Playlists are found")
      }

      return res.status(200)
                .json(new ApiResponse(200,userPlaylists,"Successfully fetched all the user Playlists"))
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const{playlistId} = req.params
    
    if(!playlistId){
        throw new ApiError(400,"PlaylistId is not found")
    }

     const playlist = await Playlist.findById(playlistId)
     if(!playlist){
        throw new ApiError(404,"Playlist not found")
     }

    if(!playlist.owner.equals(req.user._id)){
           throw new ApiError(403,"You are not the playlist owner to delete the playlist")
    }
    
    const deletedPlaylist = await Playlist.findByIdAndDelete({
        _id : playlistId,
        owner:req.user._id
    })

    if(!deletedPlaylist){
           throw new ApiError(404,"Already deleted the playlist or not exists")
    }
    return res.status(200)
            .json(new ApiResponse(200,deletedPlaylist,"Playlist deleted successfully"))
    
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const{videoId , playlistId} = req.params

    if(!videoId || !playlistId){
        throw new ApiError(400,"videoId or playlistId is not found")
    }

     const playlist = await Playlist.findById(playlistId)
      if(!playlist){
        throw new ApiError(404,"Playlist not found")
      }

    if(!playlist.owner.equals(req.user._id)){
           throw new ApiError(403,"You are not the playlist owner to remove the song")
    }

   const removedVideo= await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{videos:videoId}
    },{new:true})

    if(!removedVideo){
        throw new ApiError(404,"Problem while removing the video from playlist")
    }

    return res.status(200)
              .json(new ApiResponse(200,removedVideo,"Video removed from playlist successfully"))


})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const{playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400,"PlaylistId is not found")
    }

   const requestedPlaylist = await Playlist.findById(playlistId).populate("videos")

   if(!requestedPlaylist){
    throw new ApiError(404,"playlist not found ")
   }

   return res.status(200)
             .json(new ApiResponse(200,requestedPlaylist,"Fetched the playlist successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    console.log(name,description)

   
    if(!playlistId){
        throw new ApiError(400,"PlaylistId is not found")
    }

     const playlist = await Playlist.findById(playlistId)

     if(!playlist){
        throw new ApiError(404,"Playlist not found")
     }

    if(!playlist.owner.equals(req.user._id)){
           throw new ApiError(403,"You are not the playlist owner to make changes in playlist")
    }
    
    const updatedPlaylist ={}

    if(name && name.trim()!==""){
        updatedPlaylist.name = name
    }
     if(description && description.trim()!==""){
        updatedPlaylist.description = description
    }

    if(Object.keys(updatedPlaylist).length === 0 ){
        throw new ApiError(400,"No valid fields provided for update")
    }

    const result =await Playlist.findByIdAndUpdate(playlistId,
        updatedPlaylist,
        {
        new:true
       }
    )

    if(!result){
        throw new ApiError(404,"Something went wrong while updating")
    }

    return res.status(200)
              .json(new ApiResponse(200,result,"Playlist Updated successfully"))


    
})

export {
    createPlaylist,
    updatePlaylist,
    getPlaylistById,
    getUserPlaylists,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist
}