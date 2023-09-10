import { useContext, useState } from "react"
import { SongsContext } from "../../SongsData"
import {BsPlayFill,BsPauseFill} from "react-icons/bs"
import { LoadedImage } from "../utils/LoadedImage"
import { ContextMenu } from "../utils/ContextMenu"

export const SongResult = ({result,count,onClick}) =>{
    const { db:[songs],
        playing:[isPlaying,setIsPlaying],
        playlist:[currentPlaylist,setCurrentPlaylist],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause],
        displayLoad:[,setAllLoaded],
        cachedSongImages:[images,setImages] } = useContext(SongsContext)

    const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:songs,id:"search"}

    // const [activated,setActivated] = useState(false)
    // const [top,setTop] = useState(0)
    // const [left,setLeft] = useState(0)

    const songToggle = (index) =>{
        if(!songLoaded) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === songs[index]){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(songs[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    // const handleClick = (e) => {
    //     if (e.type === 'click') {
    //       console.log('Left click');
    //     } else if (e.type === 'contextmenu') {
    //       console.log('Right click');
    //       setTop(e.pageY)
    //       setLeft(e.pageX)
    //       setActivated(true)
    //     }
    //   };

    return(
        <div className="result_div">
            <div className="search_result_image_wrapper">
                <LoadedImage className="result_image" alt={result.id} src={images[result.id]} />
                {isPlaying && result.id === currentSongData.id?<BsPauseFill className='search_play' onClick={()=>songToggle(count)}/>
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
    const { db:[songs],
        page:[currentPage,setCurrentPage],
        artistRender:[showedArtist,setShowedArtist],
        playlistRender:[showedPlaylist,setShowedPlaylist],
        cachedArtistImages: [images,]} = useContext(SongsContext)

    const toggleArtist = () =>{
        setShowedArtist(result)
        setCurrentPage("artist-view")
    }
    


    return(
        <div className="result_div">
            <div className="search_result_image_wrapper" onClick={()=>setCurrentPage("artist-view")}>
                { <LoadedImage className="result_image" alt={result.id} src={images[result.id]} /> }
            </div>
            <div className="result_data" onClick={toggleArtist}>
                <p className="result_title">{result.name}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">Artist</p>
                </div>
            </div>
        </div>
    )
}

export const AlbumResult = ({result}) =>{
    const { db:[songs],
        page:[,setCurrentPage],
        playlistRender:[,setShowedPlaylist],
        cachedAlbumImages: [images,]} = useContext(SongsContext)

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
                { <LoadedImage className="result_image" alt={result.id} src={images[result.id]} /> }
            </div>
            <div className="result_data" onClick={toggleAlbum}>
                <p className="result_title">{result.name}</p>
                <div className="result_data_wrapper">
                    <p className="result_type">Album</p>
                </div>
            </div>
        </div>
    )
}