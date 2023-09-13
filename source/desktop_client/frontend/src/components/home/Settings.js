import { useContext, useState } from "react"
import { UserContext } from "../../UserContext"
import { AddSong, CreateArtist } from "../utils/UserArtistSettings"




export const Settings = () =>{

    const {access_token: [token, setToken, removeToken],
        error: [userError, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        liked_songs:[likedSongs,setLikedSongs],
        fav_artists:[favArtists,setFavArtists],
        user_playlists:[playlists,setPlaylists],
        settings:[settings,setSettings],
        user_artist_id:[userArtistId,setUserArtistId]} = useContext(UserContext)


    const [becomeArtist,setBecomeArtist] = useState(false)
    const [addSong,setAddSong] = useState(false)

    return(
        <div>
            <h1>Settings</h1>
            <p>Language: {settings.language}</p>
            <p>{userArtistId}</p>
            {!userArtistId
            ?<h1 onClick={()=>setBecomeArtist(true)}>¡Become a creator!</h1>
            :<h1 onClick={()=>setAddSong(true)}>Add song</h1>}
            {becomeArtist
            ?<CreateArtist setChange={setBecomeArtist}/>
            :""}
            {addSong
            ?<AddSong setChange={(setAddSong)}/>
            :""}
        </div>
    )
}