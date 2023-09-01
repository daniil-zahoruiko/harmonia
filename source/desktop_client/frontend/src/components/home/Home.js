import { SongCard } from "../utils/SongCard"
import "../../styles/home.css"
import { useContext,useState } from "react"
import { SongsContext } from "../../SongsData";



export const Home = () => {

    const { db:[songs],
            songData:[currentSongData,setCurrentSongData],
            playlist:[currentPlaylist,setCurrentPlaylist],
            song:[songLoaded, setSongLoaded],
            playing:[isPlaying,setIsPlaying],
            toggles:[PlayPause] } = useContext(SongsContext)


    const [hover,setHover] = useState({bool:false,key:""})


    const handleClick = (index) =>{
        if(!songLoaded){
            return
        }
        const song = songs.filter((song)=>song.id === index)[0]
        if(currentSongData.id === song.id){
            PlayPause()
            return
        }
        setCurrentPlaylist({...currentPlaylist,songs:songs})
        setSongLoaded(false)
        setCurrentSongData(song)
        if(!isPlaying) setIsPlaying(true)
    }

    return(
        <>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        songs.slice(0,5).map((song,key) =>{
                            return(
                                <SongCard isPlaying={isPlaying} currentSongData={currentSongData} hover={hover} onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover(false)} onClick={() => handleClick(song.id)} key={key} id={song.id} title={song.title} artist={song.artist}/>
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
                                <SongCard isPlaying={isPlaying} currentSongData={currentSongData} hover={hover} onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover(false)} onClick={() => handleClick(song.id)}  key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
        </>

    )
}