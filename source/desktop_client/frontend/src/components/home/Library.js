import { useContext, useState } from "react"
import { CreatePlaylistPopUp } from "../utils/PopUps"
import { PlaylistCard } from "../utils/Cards";
import { UserContext } from "../../UserContext";
import { FavArtists, LibraryPlaylists } from "../utils/Sections";



export const Library = () =>{
    const { access_token: [token, , removeToken],
        error: [, setUserError],
        username:[username,],
        liked_songs:[likedSongs,setLikedSongs],
        user_playlists:[playlists,setPlaylists], } = useContext(UserContext);

    return(
        <div>
            <h1 className="top_picks_header">Playlists</h1>
            <LibraryPlaylists/>
            <h1 className="top_picks_header">Followed Artists</h1>
            <FavArtists/>
        </div>
    )
}