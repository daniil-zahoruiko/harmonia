import { useEffect, useState,useRef, useContext } from "react"
import { UserContext } from "./UserContext"


const FetchSongs = ({token}) =>{
    const [songs, setSongs] = useState([])
    const [artists,setArtists] = useState([])
    const [albums,setAlbums] = useState([])
    const [loading,setLoading] = useState(true)
    const dataFetchedRef = useRef(false);
    const { access_token: [,,removeToken],
            error: [, setUserError],
            username:[username,setUsername],
            email:[email,setEmail],
            full_name:[fullName,setFullName],
            password:[password,setPassword],
            user_playlists:[playlists,setPlaylists],
            liked_songs:[likedSongs,setLikedSongs],
            fav_artists:[favArtists,setFavArtists],
            settings:[settings,setSettings],
            user_artist_id:[userArtistId,setUserArtistId] } = useContext(UserContext);

    const fetchData = () =>{
        fetch("/api",{
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            if(res.ok)
                return res.json();
            else
                throw new Error(res.status);
        }).then((data) => {
                // Setting a data from api
                setSongs(data.songs)
                setArtists(data.artists)
                setAlbums(data.albums)
                setPlaylists(data.playlists)
                setUsername(data.user_data.username)
                setEmail(data.user_data.email)
                setFullName(data.user_data.full_name)
                setPassword(data.user_data.password)
                setLikedSongs(data.user_data.liked_songs.likedSongs)
                setFavArtists(data.user_data.fav_artists.favArtists)
                setSettings(data.user_data.settings)
                setUserArtistId(data.user_data.artistId)
                setLoading(false)
                console.log(data)
        }).catch((error) =>
        {
            if(error.message === "401")
            {
                LogMeOut({removeToken});
                setUserError("You have been logged out");
            }
            else
            {
                console.log("Unkown error " + error.message);
            }
        })
    }

    useEffect(() => {
        if(dataFetchedRef.current) return;
        dataFetchedRef.current = true
        fetchData()
    }, []);

    return {songs,artists,albums,loading}
}

async function FetchImages({data,url,images,setImages, token,removeToken, setUserError})
{
    let response
    let temp_dict = {}
    console.log(data)
    for(let i = 0; i < data.length; i++)
        {
            const id = data[i].id

            if(!images[data[i].id]){
                response = await FetchImage({url: url + '/' + id, token:token, removeToken: removeToken, setUserError: setUserError})
                temp_dict[id] = response
            }
            if(i===data.length-1){
                setImages(prevImages=>({...prevImages,...temp_dict}))
            }
        }
}

const FetchImage = async ({url, token, removeToken, setUserError}) =>
{
    try
    {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'blob',
                'Authorization': 'Bearer ' + token
            }
        })
        if(!response.ok)
            throw new Error(response.status);

        if(response.status === 204){
            return("No Content")
        }

        const result = await response.blob();
        return(URL.createObjectURL(result));
    }
    catch(error)
    {
        if(error.message === "401")
        {
            LogMeOut({removeToken});
            setUserError("You have been logged out");
        }
        else
        {
            console.log("Unknown error " + error.message);
        }
    }
}

async function LogMeIn({setToken, setError, username, password})
{
    // TODO: obtain all user data
    return await fetch('/token', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();

        if(response.ok){
            setToken(jsonResponse.token);
            console.log(jsonResponse.user_data)
        }
        else if(response.status === 401)
            throw new Error(jsonResponse.msg);
        else
            throw new Error('Unknown error ' + response.status);
    })
}

async function SignMeUp({username, password,email,full_name})
{
    return await fetch("/signup", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
            "email":email,
            "full_name":full_name
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

const LogMeOut = ({removeToken}) =>
{ 
    fetch('/logout', {
        method: "POST"
    })
    .then((response) => {
        if(!response.ok) throw new Error(response.status);
        else removeToken();
    });
}

async function UpdateLikedSongs({token,username,likedSongs}){
    return await fetch("/api/like_song", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "username": username,
            "liked_songs": {"likedSongs":likedSongs}
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function UpdateFavArtists({token,username,favArtists}){
    return await fetch("/api/fav_artist", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "username": username,
            "fav_artists": {"favArtists":favArtists}
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function AddStreams({token,streams,song_id}){
    return await fetch("/api/add_streams", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "id": song_id,
            "streams": streams
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function updateData({token,username,email,fullName,input}){
    return await fetch("/api/change_data", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "username": username,
            "email":email,
            "full_name":fullName,
            "input": input
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function createPlaylist({token,name,setPlaylists,setShowedPlaylist,username}){
    return await fetch("/api/add_playlist", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "name":name
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();

        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }else{
            return jsonResponse
        }
    }).then(async (data)=>{
        setPlaylists(data)
        setShowedPlaylist({owner:"#"+username,type:"private",name:data[data.length-1].name,description:"",songs:[],id:data[data.length-1].id})
    });
}

async function deletePlaylist({token,id,setPlaylists}){
    return await fetch(`/delete_playlist/${id}`, {
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }).then(async (response) => {
        const jsonResponse = await response.json();

        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }else{
            return jsonResponse
        }
    }).then(async (data)=>{
        setPlaylists(data)
    });
}

async function updatePlaylist({token,id,name,description,data}){
    return await fetch("/api/update_playlist", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "name":name,
            "id":id,
            "description":description,
            "data":data
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();

        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function addPlaylistSongs({token,id,songs}){
    return await fetch("/add_playlist_song", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "id":id,
            "songs":songs
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}

async function changePlaylistImage({token,id,image}){
    return await fetch(`/change_playlist_image/${id}`, {
        method: "POST",
        headers:{
            'Authorization': 'Bearer ' + token
        },
        body: image
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}


async function createArtist({token,data,setUserArtistId}){
    return await fetch(`/create_artist`, {
        method: "POST",
        headers:{
            'Authorization': 'Bearer ' + token
        },
        body: data
    }).then(async (response) => {
        const jsonResponse = await response.json();
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
        return jsonResponse;
    }).then(async (data)=>{
        setUserArtistId(data.artist_id)
    });
}

async function addSong({token,data}){
    return await fetch("/add_song", {
        method: "POST",
        headers:{
            'Authorization': 'Bearer ' + token
        },
        body: data
    }).then(async (response) => {
        const jsonResponse = await response.json();
        
        if(!response.ok)
        {
            if(response.status === 401)
                throw new Error(jsonResponse.msg);
            else
                throw new Error('Unknown error ' + response.status);
        }
    });
}


export { FetchSongs,
        FetchImages,
        FetchImage,
        LogMeIn,
        SignMeUp,
        LogMeOut,
        UpdateLikedSongs,
        UpdateFavArtists,
        AddStreams,
        updateData,
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addPlaylistSongs,
        changePlaylistImage,
        createArtist,
        addSong };