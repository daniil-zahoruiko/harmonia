import React, { useContext, useEffect, useRef, useState } from "react";
import { useToken } from "./components/utils/useToken";
import { Audio } from "./components/songPlayer/Audio";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { LoggedOut } from "./components/home/LoggedOut";
import "./App.css";
import SongsData from "./SongsData";
import { UserContext, GetUserValue } from "./UserContext";
import { Home } from "./components/home/Home";
import Profile from "./components/home/Profile";
import { Discover } from "./components/home/Discover";
import { PlaylistView } from "./components/utils/PlaylistView";
import { ChangeData } from "./components/home/ChangeData";
import { ArtistView } from "./components/utils/ArtistView";
import { FavArtists } from "./components/utils/PlaylistViewCard";
import { Library } from "./components/home/Library";
import { Route, Routes, useLocation } from "react-router-dom";
import "./styles/mainWindow.css"


function App() {
    const user = GetUserValue();
    const {access_token: [token, ,]} = user;

    const pageRef = useRef(null)
    const { pathname } = useLocation();

    useEffect(()=>{
        if(pageRef.current){
            console.log("huy")
            pageRef.current.scrollTo({ top: 0});
        }
    },[pathname])

    return (
        <UserContext.Provider value={user}>
            {token == "" || token == null
            ? <LoggedOut/>
            : (<SongsData>
                <div className="App">
                    <Nav/>
                    <LeftBar/>
                    <div ref={pageRef} className="main_window_wrapper">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/discover" element={<Discover/>}/>
                            <Route path="/playlist" element={<PlaylistView/>}/>
                            <Route path="/change" element={<ChangeData/>}/>
                            <Route path="/artist" element={<ArtistView/>}/>
                            <Route path="/favorites" element={<FavArtists/>}/>
                            <Route path="/library" element={<Library/>}/>
                        </Routes>
                    </div>
                    <Audio/>
                </div>
            </SongsData>)}
        </UserContext.Provider>

    );
}

export default App;