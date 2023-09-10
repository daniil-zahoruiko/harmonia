import { useContext, useEffect, useRef, useState } from "react";
import "../../styles/contextmenu.css"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { UpdateLikedSongs, addPlaylistSongs } from "../../api";
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
        liked_songs:[likedSongs,setLikedSongs],
        user_playlists:[playlists,setPlaylists], } = useContext(UserContext);

    const menuRef = useRef(null)
    const listRef = useRef(null)

    const closeMenu = (e) =>{
        if(menuRef.current && activated && !menuRef.current.contains(e.target) && listRef.current && activated && !listRef.current.contains(e.target)){
            setActivated(false)
            setStyle("closed")
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

    const [style,setStyle] = useState("closed")
    const togglePLList = () =>{
        if(style === "closed"){
            setStyle("opened")
        }else{
            setStyle("closed")
        }
    }

    const [width,setWidth] = useState(0)


    useEffect(()=>{
        if(left + (menuRef.current ? menuRef.current.offsetWidth : 0)+(listRef.current ? listRef.current.offsetWidth : 0)>window.innerWidth){
            setWidth(left-(listRef.current.offsetWidth))
        }else{
            setWidth(left+(menuRef.current ? menuRef.current.offsetWidth : 0))
        }
    },[left])

    const addSong = (playlist) => {
        console.log(playlist,song)
        var keys = Object.keys(playlist.songs)
        let temp_dict = {...playlist}
        if(!keys.includes(song.id)){
            temp_dict.songs[song.id] = song
            console.log(playlist)
            addPlaylistSongs({token:token,id:playlist.id,songs:playlist.songs})
        }
        else{
            console.log("current Song already exists in playlist")
        }
    }

    if(!song) return

    // console.log(playlists)



    return(
        <div >
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
            <div onClick={togglePLList} className="context_menu_like">
                <p>Add to playlist</p>
                <div className={`context_playlist_arrow ${style}`}></div>
            </div>
        </div>
        <div ref={listRef} style={{
            display:"block",
            left:`${width}px`,
            zIndex:`${style === "closed"?"-99":"22"}`,
            top:`${top}px`}} className="context_menu">
            {playlists.map((playlist,key)=>{
                return <p onClick={()=>addSong(playlist)} key={key}>{playlist.name}</p>
            })}
        </div>
        </div>
    )
}