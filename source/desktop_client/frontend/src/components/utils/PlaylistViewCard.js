import { useContext, useState } from "react"
import { UserContext } from "../../UserContext"
import { FetchImages } from "../../api";
import { SongCard } from "./SongCard";

export const PlaylistViewCard = ({songs}) =>
{
    const {access_token: [token,,]} = useContext(UserContext);

    const [images, setImages] = useState([]);
    FetchImages({songs, token, setImagesUrl: setImages});

    return songs.map((song,key) => 
        (<SongCard key={key} id={song.id} title={song.title} artist={song.artist} imageUrl={images[key]}/>)
    )
}