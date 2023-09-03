import { useContext, useEffect, useState } from "react";
import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";


export const SongCard = ({song, imageUrl,songs,images}) => {

    const { songData:[currentSongData,setCurrentSongData],
        playlist:[currentPlaylist,setCurrentPlaylist],
        song:[songLoaded, setSongLoaded],
        playing:[isPlaying,setIsPlaying],
        toggles:[PlayPause],
        displayLoad:[allLoaded,setAllLoaded] } = useContext(SongsContext)


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

    useEffect(()=>{
        console.log("I invoked")
        if(!images) return null
        if(images.length === songs.length){
            setAllLoaded(true)
        }
        else {
            setAllLoaded(false)
        }
        console.log(images)
    },[images])


    return(
        <div onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover({key:song.id,bool:false})} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={song.title} src={imageUrl}/>
            <h1 className="song_card_title">{song.title}</h1>
            <p className="song_card_artist">{song.artist}</p>
            {hover.bool && hover.key === song.id
                ?currentSongData.id === song.id && isPlaying
                ?<BsFillPauseCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>handleClick(song.id)}/>
                :<BsFillPlayCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>handleClick(song.id)}/>
                :""
            }
        </div>
    )
}