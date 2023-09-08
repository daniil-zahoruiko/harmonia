import { useContext } from "react"
import { SongsContext } from "../../SongsData"




export const ArtistResult = ({result}) =>{
    const { db:[songs],
        page:[currentPage,setCurrentPage],
        artistRender:[showedArtist,setShowedArtist],
        playlistRender:[showedPlaylist,setShowedPlaylist]} = useContext(SongsContext)

    const toggleArtist = () =>{
        setShowedArtist(result)
        setCurrentPage("artist-view")
    }
    const toggleAlbum = ()=>{
        setShowedPlaylist({ owner:"",
                            type:"album",
                            name:result.name,
                            description:"",
                            songs:songs.filter(song=>{
                                return song.albumId === result.id
                            }),
                            id:result.id+"_album"})

        setCurrentPage("playlist-view")
    }


    return(
        <div className="result_div">
            <div className="search_result_image_wrapper" onClick={()=>setCurrentPage("artist-view")}>
                {/* <LoadedImage className="result_image" alt={result.id} src={images[result.id]} /> */}
                {/* {isPlaying && result.id === currentSongData.id?<BsPauseFill className='search_play' onClick={()=>songToggle(key)}/>
                :<BsPlayFill className='search_play' onClick={()=>songToggle(key)}/>} */}
            </div>
            <div className="result_data" onClick={!result.artist?toggleArtist:toggleAlbum}>
                <p className="result_title">{result.name}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">{!result.artist?"Artist":"Album"}</p>
                </div>
            </div>
            <p className="result_album">{result.album}</p>
        </div>
    )
}