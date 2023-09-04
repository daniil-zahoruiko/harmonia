import { useContext, useEffect, useState } from "react"
import "../../styles/searchresults.css"
import { SongsContext } from "../../SongsData"
import { FetchImages } from "../../api"
import { UserContext } from "../../UserContext"
import { LoadedImage } from "../utils/LoadedImage"
import {BsPlayFill,BsPauseFill} from "react-icons/bs"

export const SearchResults = ({results, setResult, setInput}) => {
    const {   db:[songs],
        playing:[isPlaying,setIsPlaying],
        playlist:[currentPlaylist,setCurrentPlaylist],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause],
        displayLoad:[allLoaded,setAllLoaded],
        playlistView:[playlistView,setPlaylistView] } = useContext(SongsContext)
    
    const {access_token: [token,,]} = useContext(UserContext);
    const images = FetchImages({songs: results, token: token});
    const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:songs,id:"search"}

    // song onclick functionality
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

    useEffect(()=>{
        if(!images) return null
        if(images.length === results.length){
            setAllLoaded(true)
        }
        else {
            setAllLoaded(false)
        }
    },[images])

    return (
        <div className="results_list">
            {results.map((result,key)=>{
                return(
                    <div className="result_div" key={key}>
                        <div className="search_result_image_wrapper">
                            <LoadedImage className="result_image" alt={result.id} src={images[key]} />
                            {isPlaying && result.id === currentSongData.id?<BsPauseFill className='search_play' onClick={()=>songToggle(key)}/>
                            :<BsPlayFill className='search_play' onClick={()=>songToggle(key)}/>}
                        </div>
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