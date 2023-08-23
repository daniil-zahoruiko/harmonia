import { SongCard } from "../utils/SongCard"
import "../../styles/home.css"
import { useCallback, useContext } from "react"
import { SongsContext } from "../../SongsData";



export const Home = () => {

    const {db:[songs,loading]} = useContext(SongsContext)
    const {songData:[currentSongData,setCurrentSongData]} = useContext(SongsContext)
    const {playlist:[currentPlaylist,setCurrentPlaylist]} = useContext(SongsContext)

    const handleClick = (index) =>{
        console.log(index)
        setCurrentPlaylist({...currentPlaylist,songs:songs})
        setCurrentSongData(songs.filter((song)=>song.id === index)[0])
        console.log(songs.filter((song)=>song.id === index)[0],currentSongData)
    }

    return(
        <>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        songs.slice(0,5).map((song,key) =>{
                            return(
                                <SongCard onClick={() => handleClick(song.id)} key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        songs.slice(5,10).map((song,key) =>{
                            return(
                                <SongCard onClick={() => handleClick(song.id)}  key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
        </>

    )
}