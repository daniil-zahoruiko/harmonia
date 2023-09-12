import { useState } from "react"
import { CreatePlaylistPopUp } from "../utils/PopUps"



export const Library = () =>{

    const [activate,setActivate] = useState(false)

    return(
        <div>
            <button onClick={()=>setActivate(true)}>Create playlist</button>
            <CreatePlaylistPopUp activated={activate} />
        </div>
    )
}