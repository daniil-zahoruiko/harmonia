import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"


export const SongCard = ({onClick, id, title, artist}) => {

    return(
        <div onClick={onClick} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={title} src={`api/artist/${id}/cover/`}/>
            <h1 className="song_card_title">{title}</h1>
            <p className="song_card_artist">{artist}</p>
        </div>
    )
}