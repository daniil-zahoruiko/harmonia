import { useContext, useEffect } from 'react';
import { SongsContext } from "../../SongsData"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from './LoadedImage';
import "../../styles/playlistview.css"
import { FetchImages } from '../../api';
import { UserContext } from '../../UserContext';
import { SongRow } from './SongRow';
import { SongCard } from './Cards';
import {AiFillHeart,AiOutlineClockCircle} from "react-icons/ai"



export const PlaylistView = ({owner,type, name, description, songs,id}) =>{
    const {   playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            playlistView:[playlistView,setPlaylistView],
        cachedSongImages:[images,setImages] } = useContext(SongsContext)

    const {
        access_token: [token,,removeToken],
        error: [,setUserError]
    } = useContext(UserContext);

    const data = {owner:owner,type:type,name:name,description:description,songs:songs,id:id}
    const isEmpty = songs.length === 0

    // const images = FetchImages({songs, token});
    const fetch = async (data, url) =>{
        await FetchImages({data:data, url:url, token,removeToken,setUserError,setAllLoaded,images,setImages})
        setAllLoaded(true);
    }
    useEffect(()=>{
        setAllLoaded(false)
        fetch(songs, '/api/song/cover')
    },[])

    // play/pause button functionality
    const pauseButtonToggle = () =>{
        if(isEmpty) return
        if(currentPlaylist.id !== id){
            setSongLoaded(false)
            setCurrentPlaylist(data)
            setCurrentSongData(songs[0])
            if(!isPlaying) setIsPlaying(true)
        }
        else{
            PlayPause()
        }
    }

    // song onclick functionality
    const songToggle = (index) =>{
        if(!songLoaded || isEmpty) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === songs[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(songs[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    const viewToggle = () =>{
        if(playlistView === "row"){
            setPlaylistView("card")
        }
        else{
            setPlaylistView("row")
        }
    }

    return(
        <div>
            <div className="playlist_header">
                {id==="liked_songs"
                ?<div className="playlist_image liked_playlist_image"><AiFillHeart/></div>
                :id==="recent_songs"?<div className="playlist_image liked_playlist_image"><AiOutlineClockCircle/></div>
                :<LoadedImage className="playlist_image" src={isEmpty?"none":images[songs[0].id]} />}
                <div className="playlist_data">
                    <p className='playlist_type'>{type} playlist</p>
                    <p className='playlist_name'>{name}</p>
                    <p className='playlist_description'>{description}</p>
                    <p className='playlist_owner'>{owner}</p>
                </div>
            </div>
            <div className="playlist_utils">
                <div className='play_playlist_wrapper'>
                    {isPlaying && currentPlaylist.id === id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>
                    :<BsFillPlayCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>}
                </div>
                <button className='playlist_view_toggle' onClick={viewToggle}>Change view</button>
            </div>
            {
                playlistView==="row"?
                <table className='songs_list'>
                    <colgroup>
                        <col className='n_col'/>
                        <col className='title_col'/>
                        <col className='album_col'/>
                        <col/>
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
                            <th/>
                            <th>
                                <p>Length</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song,key)=>{
                            return(
                            <SongRow key={key} songs={songs} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                            )
                        })}
                    </tbody>
                </table>
                :<div className='songs_cards'>
                    {songs.map((song,key)=>{
                        return(
                            <SongCard key={key} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                        )
                    })}
                </div>
            }
        </div>
    )
}