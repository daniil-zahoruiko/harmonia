import { Home } from "./home/Home"
import "../styles/mainWindow.css"
import { Discover } from "./home/Discover"
import React, {useContext} from "react"
import { SongsContext } from "../SongsData"
import { PlaylistView } from "./utils/PlaylistView"
import Profile from "./home/Profile"

export const MainWindow = () => {
    const { page:[currentPage,],
            playlistRender:[showedPlaylist,]} = useContext(SongsContext)

    if(currentPage==="home"){
        return(
            <div className="main_window_wrapper">
                <Home/>
            </div>
        )
    }else if(currentPage === "user_account"){
        return(
            <div className="main_window_wrapper">
                <Profile/>
            </div>
        );
    }else if(currentPage === "discover"){
        return(
            <div className="main_window_wrapper">
                <Discover/>
            </div>
        )
    }else if(currentPage === "playlist-view"){
        return(
            <div className="main_window_wrapper">
                <PlaylistView
                owner={showedPlaylist.owner}
                 type={showedPlaylist.type}
                 name={showedPlaylist.name}
                 description={showedPlaylist.description}
                 songs = {showedPlaylist.songs}
                 id = {showedPlaylist.id}
                 />
            </div>
        )
    }

}