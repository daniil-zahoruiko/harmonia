import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../UserContext"
import { ArtistCard, PlaylistCard, SongCard } from "./Cards"; 
import { SongsContext } from "../../SongsData";
import { FetchImages } from "../../api";
import { ContextMenu } from "./ContextMenu";
import { LoadedImage } from "./LoadedImage";
import { CreatePlaylistPopUp } from "./PopUps";

export const TopPicks = ({songs}) =>
{
    const { playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            cachedAlbumImages:[images,setImages],
            db:[,,albums], } = useContext(SongsContext)

    const {access_token: [token,,refreshToken,removeToken],
    error: [,setUserError]} = useContext(UserContext);

    const firstRender = useRef(true)

    const albumIdsSet = new Set(songs.map((song)=>{
        return song.albumId
    }))

    const albumsToFetch = albums.filter((album)=>{
        return albumIdsSet.has(album.id)
    })

    const fetch = async (data, url) =>{
        await FetchImages({data:data, url: url, token,removeToken, refreshToken, setUserError,setAllLoaded,images,setImages});
        setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }
        else{
            setAllLoaded(false)
            fetch(albumsToFetch, '/api/album/cover')
        }
    },[])

    const data = {owner:"Harmonis",type:"public",name:"Top picks",description:"",songs:songs,id:"top_picks"}

    const songToggle = (index) =>{
        if(!songLoaded) return
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

    const [activated,setActivated] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const [contextId,setContextId] = useState(0)

    const handleClick = (e,value) => {
        setTop(e.pageY)
        setLeft(e.pageX)
        setActivated(true)
        setContextId(value)
    }

    return(
    <>
    {songs.map((song,key) =>
        (<SongCard onContextMenu={(e) =>handleClick(e,key)} key={key} song={song} imageUrl={images[song.albumId]} songToggle={songToggle} id={key} playlistId={data.id}/>))}
        <ContextMenu song={data.songs[contextId]} activated={activated} setActivated={setActivated} top={top} left={left}/>
    </>)
}


export const FavArtists = () =>{
    const {
        access_token: [token,,refreshToken,removeToken],
        error: [,setUserError],
        username:[username,],
        fav_artists:[favArtists,]
    } = useContext(UserContext);

    const {
        cachedArtistImages:[images, setImages],
        displayLoad:[,setAllLoaded]
    } = useContext(SongsContext);

    const artists = Object.keys(favArtists).map((key)=>{return favArtists[key]})

    const firstRender = useRef(true);

    const fetch = async (data, url) =>{
        await FetchImages({data:data,url:url, token,removeToken, refreshToken, setUserError,setAllLoaded,images,setImages})
        setAllLoaded(true)
    }

    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }else{
            setAllLoaded(false)
            fetch(Object.keys(favArtists).map((key)=>{return favArtists[key]}), "/api/artist/cover");
        }
    },[])

    return(
            <div className='songs_cards'>
                {artists.map((artist,key)=>{
                    return(
                        <ArtistCard artist={artist} key={key}/>
                    )
                })}
            </div>
    )
}


export const LibraryPlaylists = () =>{
    const { displayLoad:[,setAllLoaded],
        cachedPlaylistImages:[playlistImages,setPlaylistImages] } = useContext(SongsContext)

        const {
            access_token: [token,,refreshToken,removeToken],
            error: [,setUserError],
            user_playlists:[playlists],
        } = useContext(UserContext);


    const firstRender = useRef(true);
    const [activate,setActivate] = useState(false)

    const fetch = async (data, url,images,setImages,last) =>{
        await FetchImages({data:data, url:url, token,removeToken,refreshToken,setUserError,setAllLoaded,images:images,setImages:setImages})
        if (last) setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }
        else{
            setAllLoaded(false)
            fetch(playlists, '/api/playlist/cover', playlistImages, setPlaylistImages,true)
        }
    },[])


    return(
            <div className='songs_cards'>
                {playlists.map((playlist,key)=>{
                    return(
                        <PlaylistCard playlist={playlist} key={key}/>
                    )
                })}
                <div to="/playlist" onClick={()=>setActivate(true)} className="SongCard" style={{background:"#44444f"}}>
                    <LoadedImage className={"songcard_img"} alt={"add_new_playlist"} src={"add_new_playlist"}/>
                    <h1 className="song_card_title">Add new playlist</h1>
                </div>
                {activate?<CreatePlaylistPopUp setActivate={setActivate}/>:""}
            </div>
    )
}