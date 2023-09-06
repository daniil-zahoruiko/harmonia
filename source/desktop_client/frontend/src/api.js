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

async function FetchImages({songs,images,setImages, token,removeToken, setUserError,setAllLoaded})
{
    let response
    let temp_dict = {}
    for(let i = 0; i < songs.length; i++)
        {
            const id = songs[i].id

            if(!images[songs[i].id]){
                response = await FetchImage({id: id, token:token, removeToken: removeToken, setUserError: setUserError})
                temp_dict[id] = response
            }
            if(i===songs.length-1){
                console.log(temp_dict)
                setImages(prevImages=>({...prevImages,...temp_dict}))
                setAllLoaded(true)
            }
        }
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

async function LogMeIn({setToken,setUserData, setError, username, password})
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

        if(response.ok){
            setToken(jsonResponse.token);
            console.log(jsonResponse.user_data)
            setUserData(jsonResponse.user_data)
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
            'Content-Type': 'application/json',
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

export { FetchSongs, FetchImages, FetchImage, LogMeIn, SignMeUp, LogMeOut };