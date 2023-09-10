import { useContext } from "react";
import "../../styles/contextmenu.css"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { UpdateLikedSongs } from "../../api";


export const ContextMenu = () =>{

    const { db:[,artists,],
        playlist:[currentPlaylist,],
        playing:[isPlaying, setIsPlaying],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause],
        artistRender:[,setShowedArtist],
        page:[,setCurrentPage],
        recentlyPlayed:[recentlyPlayed,setRecentlyPlayed] } = useContext(SongsContext)

const { access_token: [token, , removeToken],
        error: [, setUserError],
        username:[username,],
        liked_songs:[likedSongs,setLikedSongs] } = useContext(UserContext);


    const likeSong = () =>{
        var keys = Object.keys(likedSongs)
        let temp_dict = {...likedSongs}
        if(!keys.includes(currentSongData.id)){
            temp_dict[currentSongData.id] = currentSongData
            setLikedSongs(temp_dict)
        }
        else{
            delete temp_dict[currentSongData.id]
            setLikedSongs(temp_dict)
        }
        UpdateLikedSongs({token:token,username:username,likedSongs:temp_dict})
        }


    return(
        <div className="context_menu">
            <h1>Context Menu</h1>
        </div>
    )
}