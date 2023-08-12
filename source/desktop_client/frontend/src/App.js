import React, { useState, useEffect } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import "./App.css";
 
function App() {

    const [songs, setSongs] = useState([])
    const [loading,setLoading] = useState(true)
    const [userPlaylists, setUserPlaylist] = useState([])

    // // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/api").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setSongs(data.user.songs)
                setLoading(false)
                setUserPlaylist(data.user.playlists)
                console.log(data)
            })
        );
    }, []);


    // Load loader page until data is loaded
    if(loading) return <Loader/>



    return (
            <div className="App">
                <Nav/>
                <LeftBar userPlaylists = {userPlaylists}/>
                <MainWindow songs = {songs}/>
                <Audio songs={songs} setSongs={setSongs}/>
            </div>

    );
}

export default App;