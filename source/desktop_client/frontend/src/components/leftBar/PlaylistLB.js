import { useState, useContext } from "react"
import {MdOutlineLibraryMusic} from "react-icons/md"
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import { getValues } from "../helpers";
import { Link } from "react-router-dom";
import { CreatePlaylistPopUp } from "../utils/PopUps";
import { useTranslation } from "react-i18next";


export const PlaylistLB = ({lbState}) => {
    const {username:[username,],
        user_playlists:[playlists]} = useContext(UserContext)

    const {playlistRender:[,setShowedPlaylist]} = useContext(SongsContext)

    const [style, setStyle] = useState("closed")
    const [activate,setActivate] = useState(false)
    const [t,i18n] = useTranslation("leftbar")

    const togglePlaylist = () => {
        if(style === "closed"){
            setStyle("opened")
        }else{
            setStyle("closed")
        }
    }

    const openPlaylist = (id) =>{
        const cur_playlist = playlists.filter(song=>{return song.id === id})[0]
        const songs = getValues(cur_playlist.songs)
        const data = {owner:"#"+username,type:"private",name:cur_playlist.name,description:cur_playlist.description,songs:songs,id:cur_playlist.id}
        setShowedPlaylist(data)
    }


    return(
        <div className="left_bar_playlists_wrapper">
            <div className="left_bar_topic_wrapper playlist_left_bar">
                <Link to="/library" className="left_bar_playlists_text_header">
                    <div>
                        <MdOutlineLibraryMusic className="lb_svg"/>
                    </div>
                    <div className={"left_bar_topic_text lb_"+lbState}>
                        <p className="left_bar_playlist_text">
                            {t("playlists")}
                        </p>
                    </div>
                </Link>
                <div className={"lb_playlist_actions lb_"+lbState}>
                    <p onClick={()=>{setActivate(true)}}>+</p>
                    <div onClick={togglePlaylist} className={`playlist_arrow ${style}`}></div>
                </div>
            </div>
            <div className={"left_bar_playlists_list list_"+style}>
                {
                    playlists.map((playlist,key)=>{
                        return(
                            <Link to="/playlist" onClick={()=>openPlaylist(playlist.id)} className={`lb_playlist lb_${lbState}`} key={key}>{playlist.name}</Link>
                        )
                    })}
            </div>
            {activate
            ?<CreatePlaylistPopUp setActivate={setActivate}/>
            :""}
        </div>
    )
}