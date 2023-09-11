import { useContext, useEffect, useRef, useState } from "react";
import "../../styles/contextmenu.css"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { UpdateLikedSongs, addPlaylistSongs } from "../../api";
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import {MdCancel} from "react-icons/md"


const ContextPopUp = ({message,exit}) =>{
    return(
        <div className="context_popup">
            <div className="context_popup_inner">
                <div className="context_popup_inner_wrapper">
                    <MdCancel onClick={exit} className="context_exit"/>
                    <div className="context_popup_message_wrapper">
                        <h1 className="context_popup_message">{message}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ContextMenu = ({song,top,left,activated,setActivated}) =>{

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
    const [exists,setExists] = useState({"bool":false,"playlist":""})
    const [success,setSuccess] = useState({"bool":false,"playlist":""})


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
            setSuccess({"bool":true,"playlist":playlist.name})
            setActivated(false)
            setActiv(false);
            setStyle("closed")
        }
        else{
            console.log("current Song already exists in playlist")
            setExists({"bool":true,"playlist":playlist.name})
            setActivated(false)
            setActiv(false);
            setStyle("closed")
        }
    }

    if(!song) return

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
        {exists.bool
        ?<ContextPopUp exit={()=>setExists({"bool":false,"playlist":{}})} message={`This song already exists in ${exists.playlist}`}/>
        :""}
        {success.bool
        ?<ContextPopUp exit={()=>setSuccess({"bool":false,"playlist":{}})} message={`Added in ${success.playlist}`}/>
        :""}
        </div>
    )
}