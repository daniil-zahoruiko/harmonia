import { useContext, useRef } from "react";
import "../../styles/contextmenu.css"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { UpdateLikedSongs } from "../../api";
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"


export const ContextMenu = ({song,top,left,activated,setActivated}) =>{

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

    const menuRef = useRef(null)

    const closeMenu = (e) =>{
        if(menuRef.current && activated && !menuRef.current.contains(e.target)){
            setActivated(false)
        }
    }

    document.addEventListener('mousedown',closeMenu)


    const likeSong = () =>{
        var keys = Object.keys(likedSongs)
        let temp_dict = {...likedSongs}
        if(!keys.includes(song.id)){
            temp_dict[song.id] = song
            setLikedSongs(temp_dict)
        }
        else{
            delete temp_dict[song.id]
            setLikedSongs(temp_dict)
        }
        UpdateLikedSongs({token:token,username:username,likedSongs:temp_dict})
        }

    if(!song) return

    return(
        <div ref={menuRef} style={{
            display:`${activated?"block":"none"}`,left:`${left}px`,top:`${top}px`}} className="context_menu">
            {likedSongs[song.id]
                ?<div onClick={likeSong} className="context_menu_like">
                    <p>Remove from liked songs</p>
                    <AiFillHeart />
                </div>
                :<div onClick={likeSong} className="context_menu_like">
                    <p>Add to liked songs</p>
                    <AiOutlineHeart />
                </div>}
        </div>
    )
}