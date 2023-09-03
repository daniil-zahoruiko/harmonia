import { useContext, useEffect, useState } from "react"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from "./LoadedImage";
import { SongsContext } from "../../SongsData";




export const SongRow = ({songs,song,songToggle,id,images}) =>{
    const { songData:[currentSongData,],
        playing:[isPlaying,setIsPlaying],
        displayLoad:[allLoaded,setAllLoaded]
     } = useContext(SongsContext)
    const [hover,setHover] = useState({bool:false,id:""})

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
        <tr onMouseEnter={()=>setHover({bool:true,id:id})} onMouseLeave={()=>setHover(false)} className='song_row'>
            <td>
                <div className='song_n'>
                    {hover.bool && id===hover.id
                    ?currentSongData.id === songs[hover.id].id && isPlaying
                    ?<BsFillPauseCircleFill onClick={()=>songToggle(id)} className='song_row_play'/>
                    :<BsFillPlayCircleFill onClick={()=>songToggle(id)} className='song_row_play'/>
                    :isPlaying && currentSongData.id === song.id
                    ?
                    <div className='song_playing_animation'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    :<p style={currentSongData.id === song.id?{color:"#44489F"}:{}}>{id+1}</p>}
                </div>
            </td>
            <td>
                <div className='song_row_data'>
                    <LoadedImage className='song_row_image' src={images[id]} />
                    <div className='song_row_text'>
                        <p style={currentSongData.id === song.id?{color:"#44489F"}:{}} className='song_row_data_title'>{song.title}</p>
                        <p className='song_row_data_artist'>{song.artist}</p>
                    </div>
                </div>
            </td>
            <td>
                <div className='song_row_album'>
                    <p>{song.album}</p>
                </div>
            </td>
            <td>1:57</td>
        </tr>
    )
}