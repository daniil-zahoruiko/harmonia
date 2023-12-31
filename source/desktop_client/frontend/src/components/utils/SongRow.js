import { useContext, useState } from "react"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from "./LoadedImage";
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import { UpdateLikedSongs } from "../../api";
import { Link } from "react-router-dom";




export const SongRow = ({songs,song,songToggle,id,imageUrl,playlistId,onContextMenu,type}) =>{
    const { db:[,artists,],
        songData:[currentSongData,],
        playing:[isPlaying,],
        playlist:[currentPlaylist,],
        artistRender:[,setShowedArtist]
     } = useContext(SongsContext)

    const { access_token: [token, , ],
            username:[username,],
            liked_songs:[likedSongs,setLikedSongs]} = useContext(UserContext);

    const [hover,setHover] = useState({bool:false,id:""})
    const toInteract = currentSongData.id === song.id && currentPlaylist.id === playlistId

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

    const artistLink = ()=>{
        const song_artist = artists.filter((artist)=>{
          return artist.id === song.artistId
        })
        setShowedArtist(song_artist[0])
      }

    return(
        <tr onContextMenu={onContextMenu} onMouseEnter={()=>setHover({bool:true,id:id})} onMouseLeave={()=>setHover(false)} className='song_row'>
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
                    {type==="album"
                    ?""
                    :<LoadedImage className='song_row_image' src={imageUrl} />}
                    <div className='song_row_text'>
                        <p style={toInteract?{color:"#44489F"}:{}} className='song_row_data_title'>{song.title}</p>
                        <Link to="/artist" onClick={artistLink} className='song_row_data_artist'>{song.artist}</Link>
                    </div>
                </div>
            </td>
            {type==="album"
            ?<td/>
            :<td>
                <div className='song_row_album'>
                    <p>{song.album}</p>
                </div>
            </td>}

            {type==="artist" || type === "album"
            ?<td>
                <div className='song_row_streams'>
                    <p>{song.streams}</p>
                </div>
            </td>
            :<td/>}
            <td>
                {likedSongs[song.id]
                ?<AiFillHeart className='playlist_song_like' onClick={likeSong}/>
                :<AiOutlineHeart className='playlist_song_like' onClick={likeSong}/>}
            </td>
            <td>
                {Math.floor(song.length / 60)}:{(song.length % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}
            </td>
        </tr>
    )
}