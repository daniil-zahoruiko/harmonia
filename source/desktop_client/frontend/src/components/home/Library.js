import { FavArtists, LibraryPlaylists } from "../utils/Sections";



export const Library = () =>{

    return(
        <div>
            <h1 className="top_picks_header">Playlists</h1>
            <LibraryPlaylists/>
            <h1 className="top_picks_header">Followed Artists</h1>
            <FavArtists/>
        </div>
    )
}