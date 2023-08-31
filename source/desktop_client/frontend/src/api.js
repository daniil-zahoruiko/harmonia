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

async function LogMeIn({token, setToken, username, password})
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
        }).then((response) => {
        if(!response.ok)
            throw new Error(response.status)
        else
            return response.json();
    }).then((data) => {
        setToken(data.token);
    });
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
    }).then((response) => {
        if(!response.ok) throw new Error(response.status);
    })
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

export { FetchSongs, LogMeIn, SignMeUp, LogMeOut };