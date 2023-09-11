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
            setActiv(false)
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

    const [widthMain,setWidthMain] = useState(0)
    const [heightMain,setHeightMain] = useState(0)
    const [widthPl,setWidthPl] = useState(0)
    const [heightPl,setHeightPl] = useState(0)
    const [activ,setActiv] = useState(false)


    useEffect(()=>{
        if(left + menuRef.current.offsetWidth+listRef.current.offsetWidth>window.innerWidth){
            setWidthPl(left-(listRef.current.offsetWidth))
        }else{
            setWidthPl(left+menuRef.current.offsetWidth)
        }
        if(left+menuRef.current.offsetWidth>window.innerWidth){
            setWidthMain(left-menuRef.current.offsetWidth)
            setWidthPl(left-(listRef.current.offsetWidth)-menuRef.current.offsetWidth)
        }
        else{
            setWidthMain(left)
            setWidthPl(left+menuRef.current.offsetWidth)
        }
    },[left])

    useEffect(()=>{
        if(activated) setActiv(true)
    },[widthMain,heightMain])

    useEffect(()=>{
        if(top + menuRef.current.offsetHeight>window.innerHeight){
            setHeightMain(top-(menuRef.current.offsetHeight))
            setHeightPl(top-listRef.current.offsetHeight)
        }else{
            setHeightMain(top)
            setHeightPl(top)
        }
    },[top])

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
            display:"block",
            left:`${widthMain}px`,
            zIndex:`${activ?"22":"-99"}`,
            top:`${heightMain}px`}} className="context_menu">
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
            left:`${widthPl}px`,
            zIndex:`${style === "closed"?"-99":"22"}`,
            top:`${heightPl}px`}} className="context_menu">
            {playlists.map((playlist,key)=>{
                return <p className="context_playlist" onClick={()=>addSong(playlist)} key={key}>{playlist.name}</p>
            })}
        </div>
        </div>
    )
}