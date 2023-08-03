import { useState } from "react"
import {MdOutlineLibraryMusic} from "react-icons/md"


export const PlaylistLB = (userPlaylists) => {
    console.log(userPlaylists.userPlaylists)
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
                    <div className="left_bar_topic_text">
                        <p className="left_bar_playlist_text">Playlist</p>
                    </div>
                </div>
                <p>+</p>
                <div onClick={togglePlaylist} className={`playlist_arrow ${style}`}></div>
            </div>
            <div className="left_bar_playlists_list">
                {(style === "closed"?"":
                    userPlaylists.userPlaylists.map((value,key)=>{
                        return(
                            <p key={key}>{value}</p>
                        )
                    })
                )}
            </div>
        </div>
    )
}