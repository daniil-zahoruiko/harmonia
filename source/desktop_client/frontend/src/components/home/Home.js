import { SongCard } from "../SongCard"
import "../../styles/home.css"


export const Home = (props) => {
    console.log(props.songs)
    return(
        <>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        props.songs.map((song,key) =>{
                            return(
                                <SongCard key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        props.songs.map((song,key) =>{
                            return(
                                <SongCard key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
        </>

    )
}