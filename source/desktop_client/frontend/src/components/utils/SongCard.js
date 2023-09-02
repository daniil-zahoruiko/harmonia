import { useContext, useState } from "react";
import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";


export const SongCard = ({id, title, artist}) => {

    const { db:[songs],
        songData:[currentSongData,setCurrentSongData],
        playlist:[currentPlaylist,setCurrentPlaylist],
        song:[songLoaded, setSongLoaded],
        playing:[isPlaying,setIsPlaying],
        toggles:[PlayPause] } = useContext(SongsContext)


    const [hover,setHover] = useState({bool:false,key:""})

    const handleClick = (index) =>{
        if(!songLoaded){
            return
        }
        const song = songs.filter((song)=>song.id === index)[0]
        if(currentSongData.id === song.id){
            PlayPause()
            return
        }
        setCurrentPlaylist({...currentPlaylist,songs:songs})
        setSongLoaded(false)
        setCurrentSongData(song)
        if(!isPlaying) setIsPlaying(true)
    }




    return(
        <div onMouseEnter={()=>setHover({bool:true,key:id})} onMouseLeave={()=>setHover({key:id,bool:false})} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={title} src={`api/artist/${id}/cover/`}/>
            <h1 className="song_card_title">{title}</h1>
            <p className="song_card_artist">{artist}</p>
            {hover.bool && hover.key === id
                ?currentSongData.id === id && isPlaying
                ?<BsFillPauseCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>handleClick(id)}/>
                :<BsFillPlayCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>handleClick(id)}/>
                :""
            }
        </div>
    )
}