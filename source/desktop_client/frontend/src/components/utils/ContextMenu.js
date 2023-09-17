import { useContext, useEffect, useRef, useState } from "react";
import "../../styles/contextmenu.css"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { UpdateLikedSongs, addPlaylistSongs } from "../../api";
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import { ContextPopUp } from "./PopUps";
import { getValues } from "../helpers";




export const ContextMenu = ({song,top,left,activated,setActivated,type,modify,remove}) =>{

    const { access_token: [token],
        username:[username],
        liked_songs:[likedSongs,setLikedSongs],
        user_playlists:[playlists,setPlaylists], } = useContext(UserContext);

    const {playlistRender:[showedPlaylist,setShowedPlaylist]} = useContext(SongsContext)

    const menuRef = useRef(null)
    const listRef = useRef(null)

    const closeMenu = (e) =>{
        if(menuRef.current && activated && !menuRef.current.contains(e.target) && listRef.current && activated && !listRef.current.contains(e.target)){
            setActivated(false)
            setStyle("closed")
            setActiv(false)
            setRemoved("exit")
            setSuccess({"bool":false,"playlist":""})
            setExists({"bool":false,"playlist":""})
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
    const [removed,setRemoved] = useState()
    const [success,setSuccess] = useState({"bool":false,"playlist":""})


    useEffect(()=>{
        if(!menuRef.current || !listRef.current) return
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
        if(!menuRef.current || !listRef.current) return
        if(top + menuRef.current.offsetHeight>window.innerHeight){
            setHeightMain(top-(menuRef.current.offsetHeight))
            setHeightPl(top-listRef.current.offsetHeight)
        }else{
            setHeightMain(top)
            setHeightPl(top)
        }
    },[top])

    const addSong = (playlist) => {
        var keys = Object.keys(playlist.songs)
        let temp_dict = {...playlist}
        if(!keys.includes(song.id)){
            temp_dict.songs[song.id] = song
            addPlaylistSongs({token:token,id:playlist.id,songs:playlist.songs})
            setSuccess({"bool":true,"playlist":playlist.name})
            setActivated(false)
            setActiv(false);
            setStyle("closed")
        }
        else{
            setExists({"bool":true,"playlist":playlist.name})
            setActivated(false)
            setActiv(false);
            setStyle("closed")
        }
    }

    const removeSong = ()=>{
        const temp_playlist = [...playlists]
        const index = temp_playlist.indexOf(playlists.filter((playlist)=>{return playlist.id === showedPlaylist.id})[0])
        const cur_songs = {...playlists.filter((playlist)=>{return playlist.id === showedPlaylist.id})[0].songs}
        var keys = Object.keys(cur_songs)
        if(keys.includes(song.id)){
            delete cur_songs[song.id]
            addPlaylistSongs({token:token,id:showedPlaylist.id,songs:cur_songs})
            temp_playlist[index] = {...temp_playlist[index],songs:cur_songs}
            setPlaylists(temp_playlist)
            setShowedPlaylist({...showedPlaylist,songs:getValues(cur_songs)})
            setRemoved(true)
            setActivated(false)
            setActiv(false);
        }
        else{
            setRemoved(false)
            setActivated(false)
            setActiv(false);
        }
    }

    if(!song && type !=="modify") return

    return(
        <div >
            <div ref={menuRef} style={{
                display:"block",
                left:`${widthMain}px`,
                zIndex:`${activ?"22":"-99"}`,
                top:`${heightMain}px`}} className="context_menu">
                {type==="modify"
                ?<>
                    <div onClick={remove} className="context_menu_like">
                        <p>Remove Playlist</p>
                    </div>
                    <div onClick={modify} className="context_menu_like">
                        <p>Modify playlist</p>
                    </div>
                </>
                :<>
                    {likedSongs[song.id]
                    ?<div onClick={likeSong} className="context_menu_like">
                        <p>Remove from liked songs</p>
                        <AiFillHeart />
                    </div>
                    :<div onClick={likeSong} className="context_menu_like">
                        <p>Add to liked songs</p>
                        <AiOutlineHeart />
                    </div>}
                    {type === "playlist"
                    ?<div onClick={removeSong} className="context_menu_like">
                        <p>Remove from this playlist</p>
                    </div>:""}
                    <div onClick={togglePLList} className="context_menu_like">
                        <p>Add to playlist</p>
                        <div className={`context_playlist_arrow ${style}`}></div>
                    </div>
                </>}
            </div>
            <>
                <div ref={listRef} style={{
                    display:"block",
                    left:`${widthPl}px`,
                    zIndex:`${style === "closed"?"-99":"22"}`,
                    top:`${heightPl}px`}}
                    className="context_menu">
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
                {removed===true
                ?<ContextPopUp exit={()=>setRemoved("exit")} message={`Successfully removed from ${showedPlaylist.name}`}/>
                :removed===false?<ContextPopUp exit={()=>setRemoved("exit")} message={`This song was already removed ${showedPlaylist.name}`}/>:""}
            </>

        </div>
    )
}