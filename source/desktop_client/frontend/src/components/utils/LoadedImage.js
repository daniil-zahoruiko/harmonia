import {useContext, useState} from "react"
import { ImageSkeleton } from "./Skeleton"
import { SongsContext } from "../../SongsData"


export const LoadedImage = ({src, className, alt}) =>{
    const { displayLoad:[allLoaded,] } = useContext(SongsContext)

    return(
        <div className={className}>
            {src === "none"?<div style={{border:"1px white solid",height:"100%"}}/>
            :allLoaded
            ? <img className={className} alt={alt} style={allLoaded?{}:{display:"none"}} src={src} />
            :<ImageSkeleton/>}
        </div>
    )
}