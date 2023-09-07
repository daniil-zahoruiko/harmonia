import { useContext, useEffect, useState } from "react"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from "./LoadedImage";
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import { UpdateFavorites } from "../../api";




export const SongRow = ({songs,song,songToggle,id,imageUrl,playlistId}) =>{
    const { songData:[currentSongData,],
        playing:[isPlaying,],
        playlist:[currentPlaylist,]
     } = useContext(SongsContext)

     const {
        access_token: [token, setToken, removeToken],
        error: [userError, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        liked_songs:[likedSongs,setLikedSongs],
        fav_artists:[favArtists,setFavArtists],
        settings:[settings,setSettings] } = useContext(UserContext);

    const [hover,setHover] = useState({bool:false,id:""})
    const toInteract = currentSongData.id === song.id && currentPlaylist.id === playlistId

    const likeSong = () =>{
        let temp_list = [...likedSongs.likedSongs,song.id]
        if(!likedSongs.likedSongs.includes(song.id)){
            setLikedSongs({"likedSongs":temp_list})
        }
        else{
            temp_list = likedSongs.likedSongs.filter(id=>id!==song.id)
            setLikedSongs({"likedSongs":temp_list})
        }
        console.log(temp_list)
        UpdateFavorites({token:token,username:username,likedSongs:{"likedSongs":temp_list}})
    }

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
            <td>
                {likedSongs.likedSongs.includes(song.id)
                ?<AiFillHeart className='playlist_song_like' onClick={likeSong}/>
                :<AiOutlineHeart className='playlist_song_like' onClick={likeSong}/>}
            </td>
            <td>
                1:57
            </td>
        </tr>
    )
}