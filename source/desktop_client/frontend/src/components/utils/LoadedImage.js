import {useState} from "react"
import { ImageSkeleton } from "./Skeleton"


export const LoadedImage = ({src, className, alt}) =>{
    const [loaded,setLoaded] = useState(false)

    return(
        <div className={className}>
            {loaded?null:<ImageSkeleton/>}
            <img className={className} alt={alt} onLoad={()=>setLoaded(true)} style={loaded?{}:{display:"none"}} src={src} />
        </div>
    )
}