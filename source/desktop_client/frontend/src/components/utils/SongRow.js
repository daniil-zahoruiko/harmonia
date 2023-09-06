import { useContext, useEffect, useState } from "react"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from "./LoadedImage";
import { SongsContext } from "../../SongsData";




export const SongRow = ({songs,song,songToggle,id,imageUrl,playlistId}) =>{
    const { songData:[currentSongData,],
        playing:[isPlaying,],
        playlist:[currentPlaylist,]
     } = useContext(SongsContext)

    const [hover,setHover] = useState({bool:false,id:""})
    const toInteract = currentSongData.id === song.id && currentPlaylist.id === playlistId

    return(
        <tr onMouseEnter={()=>setHover({bool:true,id:id})} onMouseLeave={()=>setHover(false)} className='song_row'>
            <td>
                <div className='song_n'>
                    {hover.bool && id===hover.id
                    ?currentSongData.id === songs[hover.id].id && isPlaying && currentPlaylist.id === playlistId
                    ?<BsFillPauseCircleFill onClick={()=>songToggle(id)} className='song_row_play'/>
                    :<BsFillPlayCircleFill onClick={()=>songToggle(id)} className='song_row_play'/>
                    :isPlaying && toInteract
                    ?
                    <div className='song_playing_animation'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    :<p style={toInteract?{color:"#44489F"}:{}}>{id+1}</p>}
                </div>
            </td>
            <td>
                <div className='song_row_data'>
                    <LoadedImage className='song_row_image' src={imageUrl} />
                    <div className='song_row_text'>
                        <p style={toInteract?{color:"#44489F"}:{}} className='song_row_data_title'>{song.title}</p>
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