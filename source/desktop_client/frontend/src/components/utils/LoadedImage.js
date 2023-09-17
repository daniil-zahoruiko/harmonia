import {useContext, useState} from "react"
import { ImageSkeleton } from "./Skeleton"
import { SongsContext } from "../../SongsData"
import {MdAudiotrack} from "react-icons/md"
import {MdOutlineLibraryAdd} from "react-icons/md"



export const LoadedImage = ({src, className, alt}) =>{
    const { displayLoad:[allLoaded] } = useContext(SongsContext)

    return(
        <div className={className}>
            {src === "none"?<div style={{border:"1px white solid",height:"100%"}}/>
            :allLoaded
            ? src==="No Content"
            ?<MdAudiotrack className="no_content_playlist"/>
            : src==="add_new_playlist"
            ?<MdOutlineLibraryAdd className="no_content_playlist"/>
            :<img className={className} alt={alt} style={allLoaded?{}:{display:"none"}} src={src} />
            :<ImageSkeleton/>}
        </div>
    )
}