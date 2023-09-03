import { SongCard } from "../utils/SongCard"
import "../../styles/home.css"
import { useContext } from "react"
import { SongsContext } from "../../SongsData";
import { PlaylistViewCard } from "../utils/PlaylistViewCard";



export const Home = () => {

    const { db:[songs] } = useContext(SongsContext)

    return(
        <div className="top_picks_wrapper">
            <h1 className="top_picks_header">Top picks</h1>
            <div className="top_picks_songs">
                <PlaylistViewCard songs={songs.slice(0,5)}/>
            </div>
            <h1 className="top_picks_header">Top picks</h1>
            <div className="top_picks_songs">
                <PlaylistViewCard songs={songs.slice(5,10)}/>
            </div>
        </div>
    )
}