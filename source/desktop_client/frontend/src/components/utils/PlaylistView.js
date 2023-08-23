import { useContext } from 'react';
import { SongsContext } from "../../SongsData"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from './LoadedImage';
import "../../styles/playlistview.css"



export const PlaylistView = ({owner,type, name, description, image, songs,id}) =>{
  const {   playing:[isPlaying,],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, ],
            toggles:[PlayPause] } = useContext(SongsContext)


  const toggle = (index) =>{
    const data = {owner:owner,type:type,name:name,description:description,songs:songs,id:name}
    console.log(currentPlaylist.id !== id)
    if(currentPlaylist.id !== id){

        setCurrentPlaylist(data)
        if(index === -1){
            setCurrentSongData(songs[0])
        }
        else{
            setCurrentSongData(songs[index])
        }
    }else if(index !== -1){
        setCurrentSongData(songs[index])
    }
    PlayPause()

  }

    return(
        <div>
            <div className="playlist_header">
                <LoadedImage className="playlist_image" src={`/api/artist/${songs[0].id}/cover/`} />
                <div className="playlist_data">
                    <p className='playlist_type'>{type} playlist</p>
                    <p className='playlist_name'>{name}</p>
                    <p className='playlist_description'>{description}</p>
                    <p className='playlist_owner'>{owner}</p>
                </div>
            </div>
            <div className="playlist_utils">
                <div className='play_playlist_wrapper'>
                    {isPlaying && currentPlaylist.id === id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={() =>toggle(-1)}/>
                    :<BsFillPlayCircleFill className='play_playlist' color="44489F" onClick={()=>toggle(-1)}/>}
                </div>
            </div>
            <table className='songs_list'>
                <colgroup>
                    <col className='n_col'/>
                    <col className='title_col'/>
                    <col className='album_col'/>
                    <col className='time_col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            <p>#</p>
                        </th>
                        <th>
                            <p>Title</p>
                        </th>
                        <th>
                            <p>Album</p>
                        </th>
                        <th>
                            <p>Length</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song,key)=>{
                        return(
                            <tr onClick={()=>toggle(key)} className='song_row'>
                                <td>
                                    <div className='song_n'>
                                        {isPlaying && currentSongData.id === song.id?
                                        <div className='song_playing_animation'>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        :<p style={currentSongData.id === song.id?{color:"#44489F"}:{}}>{key+1}</p>}
                                    </div>
                                </td>
                                <td>
                                    <div className='song_row_data'>
                                        <LoadedImage className='song_row_image' src={`/api/artist/${song.id}/cover/`} />
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
                    })}
                </tbody>
            </table>
        </div>
    )
}