import { useContext, useState } from "react"
import { UserContext } from "../../UserContext"
import { FetchImages } from "../../api";
import { SongCard } from "./SongCard";
import { SongsContext } from "../../SongsData";

export const PlaylistViewCard = ({songs}) =>
{
    const {access_token: [token,,]} = useContext(UserContext);
    const {displayLoad:[allLoaded,setAllLoaded] } = useContext(SongsContext)

    const [images, setImages] = useState([]);
    FetchImages({songs, token, setImagesUrl: setImages,setLoaded:setAllLoaded});

    return songs.map((song,key) =>
        (<SongCard key={key} song={song} imageUrl={images[key]} songs={songs} images={images}/>)
    )
}