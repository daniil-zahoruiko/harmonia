import React, { useEffect, useState } from "react";
import { useToken } from "./components/utils/useToken";
import { Audio } from "./components/songPlayer/Audio";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import { LoggedOut } from "./components/home/LoggedOut";
import "./App.css";
import SongsData from "./SongsData";


function App() {
    const {setToken, token, removeToken} = useToken();

    return (
        token == "" || token == null
        ? <LoggedOut token={token} setToken={setToken}/>
        : (<SongsData>
            <div className="App">
                <Nav/>
                <LeftBar/>
                <MainWindow/>
                <Audio/>
            </div>
        </SongsData>)

    );
}

export default App;