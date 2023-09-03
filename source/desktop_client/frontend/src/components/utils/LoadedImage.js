import {useContext, useState} from "react"
import { ImageSkeleton } from "./Skeleton"
import { SongsContext } from "../../SongsData"


export const LoadedImage = ({src, className, alt}) =>{
    const { displayLoad:[allLoaded,] } = useContext(SongsContext)

    console.log(allLoaded)

    return(
        <div className={className}>
            {allLoaded?null:<ImageSkeleton/>}
            <img className={className} alt={alt} style={allLoaded?{}:{display:"none"}} src={src} />
        </div>
    )
}