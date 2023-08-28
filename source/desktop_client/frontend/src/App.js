import React, { useContext, useEffect, useState } from "react";
import { useToken } from "./components/utils/useToken";
import { Audio } from "./components/songPlayer/Audio";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { MainWindow } from "./components/MainWindow";
import { LoggedOut } from "./components/home/LoggedOut";
import "./App.css";
import SongsData from "./SongsData";
import { UserContext, GetUserValue } from "./UserContext";


function App() {
    const user = GetUserValue();
    const {access_token: [token, ,]} = user;

    return (
        <UserContext.Provider value={user}>
            {token == "" || token == null
            ? <LoggedOut/>
            : (<SongsData>
                <div className="App">
                    <Nav/>
                    <LeftBar/>
                    <MainWindow/>
                    <Audio/>
                </div>
            </SongsData>)}
        </UserContext.Provider>

    );
}

export default App;