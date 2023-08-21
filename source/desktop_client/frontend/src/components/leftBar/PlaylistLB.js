import { useState } from "react"
import {MdOutlineLibraryMusic} from "react-icons/md"


export const PlaylistLB = ({lbState,userPlaylists}) => {
    const [style, setStyle] = useState("closed")

    const changePlaylistArrow = () =>{
        if(style === "closed"){
            setStyle("opened")
        }else{
            setStyle("closed")
        }
    }

    const togglePlaylist = () => {
        changePlaylistArrow()
    }


    return(
        <div className="left_bar_playlists_wrapper">
            <div className="left_bar_topic_wrapper playlist_left_bar">
                <div className="left_bar_playlists_text_header">
                    <div>
                        <MdOutlineLibraryMusic className="lb_svg"/>
                    </div>
                    <div className={"left_bar_topic_text lb_"+lbState}>
                        <p className="left_bar_playlist_text">Playlist</p>
                    </div>
                </div>
                <div className={"lb_playlist_actions lb_"+lbState}>
                    <p>+</p>
                    <div onClick={togglePlaylist} className={`playlist_arrow ${style}`}></div>
                </div>
            </div>
            <div className={"left_bar_playlists_list list_"+style}>
                {
                    userPlaylists.map((value,key)=>{
                        return(
                            <p className={`lb_${lbState}`} key={key}>{value}</p>
                        )
                    })}
            </div>
        </div>
    )
}