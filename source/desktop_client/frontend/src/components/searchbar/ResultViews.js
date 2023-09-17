import { useContext } from "react"
import { SongsContext } from "../../SongsData"
import {BsPlayFill,BsPauseFill} from "react-icons/bs"
import { LoadedImage } from "../utils/LoadedImage"
import { Link } from "react-router-dom"

export const SongResult = ({result,results,count,onClick}) =>{
    const { playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            cachedAlbumImages:[images,] } = useContext(SongsContext)

    const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:results,id:"search"}

    const songToggle = (index) =>{
        if(!songLoaded) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === results[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(results[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    return(
        <div className="result_div">
            <div className="search_result_image_wrapper">
                <LoadedImage className="result_image" alt={result.id} src={images[result.albumId]} />
                {isPlaying && result.id === currentSongData.id && currentPlaylist.id === "search"?<BsPauseFill className='search_play' onClick={()=>songToggle(count)}/>
                :<BsPlayFill className='search_play' onClick={()=>songToggle(count)}/>}
            </div>
            <div onContextMenu={onClick} className="result_data">
                <p className="result_title">{result.title}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">Song</p>
                    <p className="result_artist">{result.artist}</p>
                </div>
            </div>
            <p className="result_album">{result.album}</p>
        </div>
    )
}

// ----------------------------------------------------------------

export const ArtistResult = ({result}) =>{
    const { artistRender:[,setShowedArtist],
            cachedArtistImages: [images,]} = useContext(SongsContext)

    const toggleArtist = () =>{
        setShowedArtist(result)
    }



    return(
        <div className="result_div">
            <div className="search_result_image_wrapper">
                { <LoadedImage className="result_image" alt={result.id} src={images[result.id]} /> }
            </div>
            <Link to="/artist" className="result_data" onClick={toggleArtist}>
                <p className="result_title">{result.name}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">Artist</p>
                </div>
            </Link>
        </div>
    )
}

export const AlbumResult = ({result}) =>{
    const { db:[songs],
        playlistRender:[,setShowedPlaylist],
        cachedAlbumImages: [images,]} = useContext(SongsContext)

    const toggleAlbum = ()=>{
        setShowedPlaylist(
            {   owner:"",
                type:"album",
                name:result.name,
                description:"",
                songs:songs.filter(song=>{
                    return song.albumId === result.id
                }),
                id:result.id+"_album"})
    }

    return(
        <div className="result_div">
            <div className="search_result_image_wrapper">
                { <LoadedImage className="result_image" alt={result.id} src={images[result.id]} /> }
            </div>
            <Link to="/playlist" className="result_data" onClick={toggleAlbum}>
                <p className="result_title">{result.name}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">Album</p>
                </div>
            </Link>
        </div>
    )
}