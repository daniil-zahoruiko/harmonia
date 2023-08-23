import { useContext } from "react"
import "../../styles/searchresults.css"
import { SongsContext } from "../../SongsData"

export const SearchResults = ({results, setResult, setInput}) => {
    const { playlist:[currentPlaylist,setCurrentPlaylist],
            db:[songs],
            songData:[currentSongData,setCurrentSongData]  } = useContext(SongsContext)



    const handleChange = (index)=>{
        setResult([])
        setInput("")
        setCurrentPlaylist({...currentPlaylist,songs:songs})
        setCurrentSongData(songs.filter((song)=>song.id === index)[0])
    }

    return (
        <div className="results_list">
            {results.map((result,key)=>{
                return(
                    <div onClick={()=>handleChange(result.id)} className="result_div" key={key}>
                        <img className="result_image" alt={result.id} src={`/api/artist/${result.id}/cover/`} />
                        <div className="result_data">
                            <p className="result_title">{result.title}</p>
                            <div className="result_data_wrapper">
                                <p className="result_type">Song</p>
                                <p className="result_artist">{result.artist}</p>
                            </div>
                        </div>
                        <p className="result_album">{result.album}</p>
                    </div>
                )
            })}
        </div>
    );
}