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
import { PlaylistSearchBar } from '../searchbar/SearchBar';
import {SlOptions} from "react-icons/sl"
import { ChangePlaylistData } from '../home/ChangeData';



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


    if(showedPlaylist.id===""){
        window.location.href = "/"
    }

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



    const [result,setResult] = useState(data.songs)
    const [input,setInput] = useState("")
    const [change,setChange] = useState(false)
    const firstRender = useRef(true)

    const isChangeable = data.id !== "liked_songs" && data.id !=="recent_songs" && !["hip-hop","rock","rap","trap","classical","workout","jazz","indie","country"].includes(data.id)
    const isEmpty = data.songs.length === 0


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

    useEffect(()=>{
        setResult(data.songs)
        setInput("")
    },[showedPlaylist])

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
                <div className='playlist_utils_section utils_left'>
                    <div className='play_playlist_wrapper'>
                        {isPlaying && currentPlaylist.id === data.id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>
                        :<BsFillPlayCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>}
                    </div>
                    {isChangeable
                    ?<SlOptions onClick={()=>setChange(true)} className='playlist_options'/>
                    :""}
                </div>
                <div className='playlist_utils_section utils_right'>
                    <PlaylistSearchBar input={input} setInput={setInput} songs={data.songs} setResult={setResult} />
                    <button className='playlist_view_toggle' onClick={viewToggle}>Change view</button>
                </div>
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
                        {result.map((song,key)=>{
                            return(
                            <SongRow onContextMenu={(e) =>handleClick(e,key)} key={key} songs={data.songs} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                            )
                        })}
                    </tbody>
                </table>
                :<div className='songs_cards'>
                    {result.map((song,key)=>{
                        return(
                            <SongCard onContextMenu={(e) =>handleClick(e,key)} key={key} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                        )
                    })}
                </div>
            }
            {change
            ?<ChangePlaylistData setChange={setChange}/>
            :""}
            <ContextMenu song={data.songs[contextId]} activated={activated} setActivated={setActivated} top={top} left={left} type={isNaN(data.id)?"":"playlist"}/>
        </div>
    )
}