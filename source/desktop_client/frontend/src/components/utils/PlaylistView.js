import { useContext, useEffect, useRef, useState } from 'react';
import { SongsContext } from "../../SongsData"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from './LoadedImage';
import "../../styles/playlistview.css"
import { FetchImages } from '../../api';
import { UserContext } from '../../UserContext';
import { SongRow } from './SongRow';
import { SongCard } from './Cards';
import {AiFillHeart,AiOutlineClockCircle} from "react-icons/ai"
import { ContextMenu } from './ContextMenu';



export const PlaylistView = () =>{
    const {   playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            playlistView:[playlistView,setPlaylistView],
            cachedSongImages:[images,setImages],
            cachedAlbumImages: [albumImages,],
            cachedPlaylistImages:[playlistImages,setPlaylistImages],
            playlistRender:[showedPlaylist,setShowedPlaylist] } = useContext(SongsContext)

    const {
        access_token: [token,,removeToken],
        error: [,setUserError]
    } = useContext(UserContext);

    const data = {owner:showedPlaylist.owner,
        type:showedPlaylist.type,
        name:showedPlaylist.name,
        description:showedPlaylist.description,
        songs:showedPlaylist.songs,
        id:showedPlaylist.id,
        image:showedPlaylist.image}
    const isEmpty = data.songs.length === 0
    console.log(data.songs.length,data.songs)

    const firstRender = useRef(true)

    // const images = FetchImages({songs, token});
    const fetch = async (data, url,images,setImages,last) =>{
        await FetchImages({data:data, url:url, token,removeToken,setUserError,setAllLoaded,images:images,setImages:setImages})
        if (last) setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }
        else{
            setAllLoaded(false)
            fetch(data.songs, '/api/song/cover',images,setImages)
            console.log("nigga")
            console.log(data)
            fetch([data], '/api/playlist/cover', playlistImages, setPlaylistImages,true)
        }
    },[data.id])

    // play/pause button functionality
    const pauseButtonToggle = () =>{
        if(isEmpty) return
        if(currentPlaylist.id !== data.id){
            setSongLoaded(false)
            setCurrentPlaylist(data)
            setCurrentSongData(data.songs[0])
            if(!isPlaying) setIsPlaying(true)
        }
        else{
            PlayPause()
        }
    }

    console.log(playlistImages)

    // song onclick functionality
    const songToggle = (index) =>{
        if(!songLoaded || isEmpty) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === data.songs[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(data.songs[index])
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

    const [activated,setActivated] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const [contextId,setContextId] = useState(0)

    const handleClick = (e,value) => {
        console.log(value)
        console.log('Right click');
        setTop(e.pageY)
        setLeft(e.pageX)
        setActivated(true)
        setContextId(value)
    }

    // console.log(playlistImages)

    // let image = isEmpty?"none":data.type==="album"?albumImages[data.id.slice(0,-6)]:playlistImages[data.id]?playlistImages[data.id]:images[data.songs[0].id]
    // if(isEmpty){
    //     image = "none"
    // }
    // else if(data.type==="album"){
    //     image = albumImages[data.id.slice(0,-6)]
    // }
    // else if(playlistImages[data.id]){
    //     image = playlistImages[data.id]
    // }else{
    //     image = images[data.songs[0].id]
    // }



    return(
        <div>
            <div className="playlist_header">
                {data.id==="liked_songs"
                ?<div className="playlist_image liked_playlist_image"><AiFillHeart/></div>
                :data.id==="recent_songs"?<div className="playlist_image liked_playlist_image"><AiOutlineClockCircle/></div>
                :<LoadedImage className="playlist_image" src={
                    isEmpty?"none":data.type==="album"?albumImages[data.id.slice(0,-6)]:playlistImages[data.id] !== "No Content" ?playlistImages[data.id]:images[data.songs[0].id]
                } />}
                <div className="playlist_data">
                    <p className='playlist_type'>{data.type} playlist</p>
                    <p className='playlist_name'>{data.name}</p>
                    <p className='playlist_description'>{data.description}</p>
                    <p className='playlist_owner'>{data.owner}</p>
                </div>
            </div>
            <div className="playlist_utils">
                <div className='play_playlist_wrapper'>
                    {isPlaying && currentPlaylist.id === data.id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>
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
                        {data.songs.map((song,key)=>{
                            return(
                            <SongRow onContextMenu={(e) =>handleClick(e,key)} key={key} songs={data.songs} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                            )
                        })}
                    </tbody>
                </table>
                :<div className='songs_cards'>
                    {data.songs.map((song,key)=>{
                        return(
                            <SongCard key={key} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                        )
                    })}
                </div>
            }
            <ContextMenu song={data.songs[contextId]} activated={activated} setActivated={setActivated} top={top} left={left}/>
        </div>
    )
}