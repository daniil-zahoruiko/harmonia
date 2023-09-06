import { useContext, useEffect, useState } from "react";
import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";


export const SongCard = ({song, imageUrl,songToggle,id,playlistId}) => {

    const { songData:[currentSongData,],
        playlist:[currentPlaylist,],
        playing:[isPlaying,], } = useContext(SongsContext)


    const [hover,setHover] = useState({bool:false,key:""})

    return(
        <div onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover({key:song.id,bool:false})} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={song.title} src={imageUrl}/>
            <h1 className="song_card_title">{song.title}</h1>
            <p className="song_card_artist">{song.artist}</p>
            {hover.bool && hover.key === song.id
                ?currentSongData.id === song.id && isPlaying && currentPlaylist.id === playlistId
                ?<BsFillPauseCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :<BsFillPlayCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :""
            }
        </div>
    )
}