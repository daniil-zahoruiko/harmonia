import React, { createContext,useState,useEffect } from "react";
import { Loader } from "./components/utils/Loader";
import { FetchSongs } from "./api";



export const SongsContext = createContext(null)


export default ({children}) =>{
    const {songs,loading,userPlaylists} = FetchSongs()

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPage,setCurrentPage] = useState("home")
    const [currentSongData,setCurrentSongData] = useState()
    const [currentPlaylist,setCurrentPlaylist] = useState({songs:[]})
    const [showedPlaylist,setShowedPlaylist] = useState({owner:"",type:"",name:"",description:"",songs:[],id:""})

    useEffect(()=>{
        if(!currentSongData){
            setCurrentSongData(currentPlaylist.songs[0])
        }
    },[currentPlaylist])

    useEffect(()=>{
        setCurrentPlaylist({owner:"Project name",type:"",name:"",description:"",songs:songs.slice(2,7),id:"default"})
    },[loading])

    const songsData = {
        playing:[isPlaying,setIsPlaying],
        songData:[currentSongData,setCurrentSongData],
        page:[currentPage,setCurrentPage],
        db:[songs,loading],
        user:[userPlaylists],
        playlist:[currentPlaylist,setCurrentPlaylist],
        playlistRender:[showedPlaylist,setShowedPlaylist]
    }

    return(
        <SongsContext.Provider value={songsData}>
            {
                loading || !currentSongData?<Loader/>:children
            }
        </SongsContext.Provider>
    )
}