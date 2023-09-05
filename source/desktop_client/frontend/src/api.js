import { useEffect, useState,useRef, useContext } from "react"
import { UserContext } from "./UserContext"


const FetchSongs = ({token}) =>{
    const [songs, setSongs] = useState([])
    const [loading,setLoading] = useState(true)
    const [userPlaylists, setUserPlaylist] = useState([])
    const dataFetchedRef = useRef(false);
    const {access_token: [,,removeToken],
    error: [, setUserError]} = useContext(UserContext);

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
                setSongs(data.user.songs)
                setUserPlaylist(data.user.playlists)
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

    return {songs,loading,userPlaylists}
}

async function FetchImages({songs, token,removeToken, setUserError})
{
    // const {access_token: [,,removeToken],
    // error: [,setUserError]} = useContext(UserContext);
    // const [prevSongs,setPrevSongs] = useState()

    // const count = useRef(true);
    // const [images, setImages] = useState([]);
    // if(prevSongs!== songs){

    // }
    // useEffect(() => {
    //     console.log("I called")

    //     if(count.current)
    //     {
    //         count.current = false;
    //         return;
    //     }
    //     for(let i = 0; i < songs.length; i++)
    //     {
    //         FetchImage({id: songs[i].id, token:token, removeToken: removeToken, setUserError: setUserError})
    //         .then((imageUrl) => setImages(images => [...images, {key: i, Url: imageUrl}]));
    //     }
    // },[songs.length])
    let response
    let images = []
    // console.log(songs)
    console.log("i fetched")
    for(let i = 0; i < songs.length; i++)
        {
            response = await FetchImage({id: songs[i].id, token:token, removeToken: removeToken, setUserError: setUserError})
            images.push({key:i,Url:response})
            console.log(images)
        }
    // console.log(images)
    return images.sort((a, b) => a.key > b.key ? 1 : (a.key < b.key ? -1 : 0)).map((object) => object.Url);
}

const FetchImage = async ({id, token, removeToken, setUserError}) => 
{
    try
    {
        const response = await fetch(`/api/artist/${id}/cover`, {
            method: "GET",
            headers: {
                'Content-Type': 'blob',
                'Authorization': 'Bearer ' + token
            }
        })
        if(!response.ok)
            throw new Error(response.status);

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
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(async (response) => {
        const jsonResponse = await response.json();

        if(response.ok)
            setToken(jsonResponse.token);
        else if(response.status === 401)
            throw new Error(jsonResponse.msg);
        else
            throw new Error('Unknown error ' + response.status);
    })
}

async function SignMeUp({username, password})
{
    return await fetch("/signup", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
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

export { FetchSongs, FetchImages, FetchImage, LogMeIn, SignMeUp, LogMeOut };