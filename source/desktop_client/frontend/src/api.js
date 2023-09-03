import { useEffect, useState,useRef } from "react"


const FetchSongs = ({token}) =>{
    const [songs, setSongs] = useState([])
    const [loading,setLoading] = useState(true)
    const [userPlaylists, setUserPlaylist] = useState([])
    const dataFetchedRef = useRef(false);

    const fetchData = () =>{
        fetch("/api",{
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setSongs(data.user.songs)
                setUserPlaylist(data.user.playlists)
                setLoading(false)
                console.log(data)
            })
        );
    }

    useEffect(() => {
        if(dataFetchedRef.current) return;
        dataFetchedRef.current = true
        fetchData()
    }, []);

    return {songs,loading,userPlaylists}
}

async function FetchImages({songs, token, setImagesUrl})
{
    const count = useRef(true);
    useEffect(() => {
        if(count.current)
        {
            count.current = false;
            return;
        }
        for(let i = 0; i < songs.length; i++)
        {
            fetchData({id: songs[i].id});
        }
    },[])

    const fetchData = async ({id}) => 
    {
        const response = await fetch(`/api/artist/${id}/cover`, {
            method: "GET",
            headers: {
                'Content-Type': 'blob',
                'Authorization': 'Bearer ' + token
            }
        })
        const result = await response.blob();
        setImagesUrl(imagesUrl => [...imagesUrl, URL.createObjectURL(result)]);
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

const LogMeOut = () =>
{
    fetch('/logout', {
        method: "POST"
    })
    .then((response) => {
        if(!response.ok) throw new Error(response.status);
    });
}

export { FetchSongs, FetchImages, LogMeIn, SignMeUp, LogMeOut };