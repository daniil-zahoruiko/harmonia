import React, { createContext,useState,useEffect, useContext } from "react";
import { Loader } from "./components/utils/Loader";
import { FetchSongs } from "./api";
import { UserContext } from "./UserContext";



export const SongsContext = createContext(null)

export default ({children}) =>{
    const {access_token: [token,,]} = useContext(UserContext);

    const {songs,artists,albums,loading} = FetchSongs({token: token});

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPage,setCurrentPage] = useState("home")
    const [currentSongData,setCurrentSongData] = useState()
    const [currentPlaylist,setCurrentPlaylist] = useState({songs:[]})
    const [showedPlaylist,setShowedPlaylist] = useState({owner:"",type:"",name:"",description:"",songs:[],id:""})
    const [songLoaded,setSongLoaded] = useState(false)
    const [allLoaded,setAllLoaded] = useState(false)
    const [playlistView,setPlaylistView] = useState("row")
    const [songImages,setSongImages] = useState([])
    const [artistImages,setArtistImages] = useState([])
    const [albumImages,setAlbumImages] = useState([])
    const [playlistImages,setPlaylistImages] = useState([])
    const [showedAlbum,setShowedAlbum] = useState({artist:{}})
    const [showedArtist,setShowedArtist] = useState({album:{}})
    const [recentlyPlayed,setRecentlyPlayed] = useState([])

    const PlayPause = ()=>
    {
        console.log("I am working dwa")
        setIsPlaying(!isPlaying);
    }

    useEffect(()=>{
        if(!currentSongData){
            setCurrentSongData(currentPlaylist.songs[0])
        }
    },[currentPlaylist])

    useEffect(()=>{
        setCurrentPlaylist({owner:"HARMONIA",type:"",name:"",description:"",songs:songs.slice(2,7),id:"default"})
    },[loading])

    const songsData = {
        playing:[isPlaying,setIsPlaying],
        songData:[currentSongData,setCurrentSongData],
        page:[currentPage,setCurrentPage],
        db:[songs,artists,albums],
        playlist:[currentPlaylist,setCurrentPlaylist],
        playlistRender:[showedPlaylist,setShowedPlaylist],
        song:[songLoaded,setSongLoaded],
        toggles:[PlayPause],
        displayLoad:[allLoaded,setAllLoaded],
        playlistView:[playlistView,setPlaylistView],
        cachedSongImages:[songImages,setSongImages],
        cachedArtistImages:[artistImages,setArtistImages],
        cachedAlbumImages:[albumImages,setAlbumImages],
        cachedPlaylistImages:[playlistImages,setPlaylistImages],
        albumRender:[showedAlbum,setShowedAlbum],
        artistRender:[showedArtist,setShowedArtist],
        recentlyPlayed:[recentlyPlayed,setRecentlyPlayed]
    }

    return(
        <SongsContext.Provider value={songsData}>
            {
                loading || !currentSongData?<Loader/>:children
            }
        </SongsContext.Provider>
    )
}