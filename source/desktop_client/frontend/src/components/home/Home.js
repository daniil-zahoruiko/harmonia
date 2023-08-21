import { SongCard } from "../SongCard"
import "../../styles/home.css"


export const Home = ({songs,currentIndex,setCurrentIndex}) => {

    const handleClick = (index) =>{
        if(currentIndex!==index){
            setCurrentIndex(index)
        }
    }

    return(
        <>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        songs.map((song,key) =>{
                            return(
                                <SongCard onClick={() => handleClick(key)} key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className="top_picks_wrapper">
                <h1 className="top_picks_header">Top picks</h1>
                <div className="top_picks_songs">
                    {
                        songs.map((song,key) =>{
                            return(
                                <SongCard onClick={() => handleClick(key)}  key={key} id={song.id} title={song.title} artist={song.artist}/>
                            )
                        })
                    }
                </div>
            </div>
        </>

    )
}