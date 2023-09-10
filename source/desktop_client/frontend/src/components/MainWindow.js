import { Home } from "./home/Home"
import "../styles/mainWindow.css"
import { Discover } from "./home/Discover"
import {useContext} from "react"
import { SongsContext } from "../SongsData"
import { PlaylistView } from "./utils/PlaylistView"
import Profile from "./home/Profile"
import { ChangeData } from "./home/ChangeData"
import { ArtistView } from "./utils/ArtistView"
import { FavArtists } from "./utils/PlaylistViewCard"
import { ContextMenu } from "./utils/ContextMenu"
import { Library } from "./home/Library"

export const MainWindow = () => {
    const { page:[currentPage,],
            playlistRender:[showedPlaylist,],} = useContext(SongsContext)

    return(
        <div className="main_window_wrapper">
            {currentPage==="home"
            ?<Home/>
            :currentPage === "user_account"
            ?<Profile/>
            :currentPage === "discover"
            ?<Discover/>
            :currentPage === "playlist-view"
            ?<PlaylistView/>
             :currentPage === "change-data"
             ?<ChangeData/>
             :currentPage === "artist-view"
             ?<ArtistView/>
             :currentPage === "favorite-artists"
             ?<FavArtists/>
             :currentPage === "library"
             ?<Library/>
             :""}
        </div>
    )
}