import React, { useEffect, useState } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Loader } from "./components/utils/Loader";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import "./App.css";
import { FetchSongs } from "./api";
import SongsData from "./SongsData";


function App() {
    // const {songs,loading,userPlaylists} = FetchSongs()

    // const [isPlaying, setIsPlaying] = useState(false);
    // const [currentPage,setCurrentPage] = useState("home")
    // const [currentSongData,setCurrentSongData] = useState()
    // const [currentPlaylist,setCurrentPlaylist] = useState({songs:[]})
    // const [showedPlaylist,setShowedPlaylist] = useState({type:"",name:"",description:"",songs:[]})

    // useEffect(()=>{
    //     console.log("----------",currentPlaylist.songs[0],currentPlaylist.songs)
    //     if(!currentSongData){
    //         setCurrentSongData(currentPlaylist.songs[0])
    //     }
    // },[currentPlaylist])

    // useEffect(()=>{
    //     setCurrentPlaylist({type:"",name:"",description:"",songs:songs.slice(2,7)})
    // },[loading])


    // Load loader page until data is loaded
    // if(loading || !currentSongData) return <Loader/>
    // console.log(currentPlaylist)

    // const songsData = {
    //     playing:[isPlaying,setIsPlaying],
    //     songData:[currentSongData,setCurrentSongData],
    //     page:[currentPage,setCurrentPage],
    //     db:[songs,loading],
    //     user:[userPlaylists],
    //     playlist:[currentPlaylist,setCurrentPlaylist],
    //     playlistRender:[showedPlaylist,setShowedPlaylist]
    // }


    return (
        <SongsData>
            <div className="App">
                <Nav/>
                <LeftBar/>
                <MainWindow/>
                <Audio/>
            </div>
        </SongsData>

    );
}

export default App;