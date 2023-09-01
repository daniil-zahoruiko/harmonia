import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';


export const SongCard = ({hover,isPlaying,currentSongData, onMouseEnter,onMouseLeave, onClick, id, title, artist}) => {

    return(
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={title} src={`api/artist/${id}/cover/`}/>
            <h1 className="song_card_title">{title}</h1>
            <p className="song_card_artist">{artist}</p>
            {hover.bool && hover.key === id?currentSongData.id === id && isPlaying?<BsFillPauseCircleFill onClick={onClick}/>:<BsFillPlayCircleFill onClick={onClick}/>:""}
        </div>
    )
}