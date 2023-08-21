import React, { useState } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import "./App.css";
import { FetchSongs } from "./api";

function App() {


    const [currentIndex,setCurrentIndex] = useState(0);


    const {songs,loading,userPlaylists} = FetchSongs()




    // Load loader page until data is loaded
    if(loading) return <Loader/>

    return (
            <div className="App">
                <Nav/>
                <LeftBar userPlaylists = {userPlaylists}/>
                <MainWindow songs = {songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
                <Audio songs={songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
            </div>

    );
}

export default App;