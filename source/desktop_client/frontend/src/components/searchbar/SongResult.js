import { useContext } from "react"
import { SongsContext } from "../../SongsData"
import {BsPlayFill,BsPauseFill} from "react-icons/bs"
import { LoadedImage } from "../utils/LoadedImage"





export const SongResult = ({result,count}) =>{
    const { db:[songs],
        playing:[isPlaying,setIsPlaying],
        playlist:[currentPlaylist,setCurrentPlaylist],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause],
        displayLoad:[,setAllLoaded],
        cachedImages:[images,setImages] } = useContext(SongsContext)

    const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:songs,id:"search"}

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
    return(
        <div className="result_div">
            <div className="search_result_image_wrapper">
                <LoadedImage className="result_image" alt={result.id} src={images[result.id]} />
                {isPlaying && result.id === currentSongData.id?<BsPauseFill className='search_play' onClick={()=>songToggle(count)}/>
                :<BsPlayFill className='search_play' onClick={()=>songToggle(count)}/>}
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
}