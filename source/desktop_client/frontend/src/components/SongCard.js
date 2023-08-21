import "../styles/songcard.css"


export const SongCard = (props) => {
    console.log(props)

    return(
        <div className="SongCard">
            <img alt={props.title} src={`api/artist/${props.id}/cover/`} />
            <h1 className="song_card_title">{props.title}</h1>
            <p className="song_card_artist">{props.artist}</p>
        </div>
    )
}