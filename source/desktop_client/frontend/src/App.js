import React, { useEffect, useRef } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Nav } from "./components/Nav";
import { LeftBar } from "./components/leftBar/LeftBar";
import { LoggedOut } from "./components/home/LoggedOut";
import "./App.css";
import SongsData from "./SongsData";
import { UserContext, GetUserValue } from "./UserContext";
import { Home } from "./components/home/Home";
import { Profile } from "./components/home/Profile";
import { Discover } from "./components/home/Discover";
import { PlaylistView } from "./components/utils/PlaylistView";
import { ChangeUserData } from "./components/home/ChangeData";
import { ArtistView } from "./components/utils/ArtistView";
import { Library } from "./components/home/Library";
import { Route, Routes, useLocation } from "react-router-dom";
import "./styles/mainWindow.css"
import { FollowedArtists } from "./components/utils/FollowedArtists";
import { Settings } from "./components/home/Settings";
import { useTranslation } from "react-i18next";


function App() {
    const user = GetUserValue();
    const {access_token: [token, ,]
        ,settings:[settings,]} = user;

    const pageRef = useRef(null)
    const { pathname } = useLocation();
    const [t,i18n] = useTranslation("settings")

    useEffect(()=>{
        if(pageRef.current){
            pageRef.current.scrollTo({ top: 0});
        }
    },[pathname])

    useEffect(()=>{
        if(settings) i18n.changeLanguage(settings.language)
    },[settings])

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
                            <Route path="/change" element={<ChangeUserData/>}/>
                            <Route path="/artist" element={<ArtistView/>}/>
                            <Route path="/favorites" element={<FollowedArtists/>}/>
                            <Route path="/library" element={<Library/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </Routes>
                    </div>
                    <Audio/>
                </div>
            </SongsData>)}
        </UserContext.Provider>

    );
}

export default App;