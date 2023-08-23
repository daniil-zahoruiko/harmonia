import React, { useEffect, useState } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import "./App.css";
import SongsData from "./SongsData";


function App() {
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