import { createContext, useState } from "react";
import { useToken } from "./components/utils/useToken";

const UserContext = createContext(null);

const GetUserValue = () => 
{
    const {setToken, token, removeToken} = useToken();
    const [userError, setUserError] = useState(null);
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [fullName,setFullName] = useState()
    const [password,setPassword] = useState()
    const [likedSongs,setLikedSongs] = useState()
    const [favArtists,setFavArtists] = useState()
    const [settings,setSettings] = useState()
    const [playlists,setPlaylists] = useState()
    const [userArtistId,setUserArtistId] = useState()

    const user = {
        access_token: [token, setToken, removeToken],
        error: [userError, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        liked_songs:[likedSongs,setLikedSongs],
        fav_artists:[favArtists,setFavArtists],
        user_playlists:[playlists,setPlaylists],
        settings:[settings,setSettings],
        user_artist_id:[userArtistId,setUserArtistId]
    }

    return user;
}

export {UserContext, GetUserValue};