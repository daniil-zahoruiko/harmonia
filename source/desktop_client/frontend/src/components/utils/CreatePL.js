import { useContext, useState } from "react"
import { createPlaylist } from "../../api"
import { UserContext } from "../../UserContext"
import { SongsContext } from "../../SongsData"



export const CreatePlaylistPopUp = ({activated}) =>{

    const [name,setName] = useState("")
    const{page:[currentPage,setCurrentPage],
        playlistRender:[showedPlaylist,setShowedPlaylist],} = useContext(SongsContext)
    const {access_token: [token, ,],
        user_playlists:[playlists,setPlaylists],} = useContext(UserContext)

    const submit = (e) =>{
        e.preventDefault()
        createPlaylist({token:token,name:name})
        setShowedPlaylist({owner:"HARMONIA",type:"private",name:name,description:"",songs:[],id:"new"})
        setCurrentPage("playlist-view")
    }

    return(
        <form onSubmit={submit} style={{display:`${activated?"block":"none"}`}}>
            <label htmlFor="Name"></label>
            <input onChange={(e)=>setName(e.target.value)} value={name} id="Name" placeholder="Name" />
            <input id="Name" type="submit" placeholder="Name" />
        </form>
    )
}