import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../UserContext"
import { FetchImages } from "../../api";
import { SongCard } from "./SongCard";
import { SongsContext } from "../../SongsData";

export const TopPicks = ({songs}) =>
{
    const {   playing:[isPlaying,setIsPlaying],
        playlist:[currentPlaylist,setCurrentPlaylist],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause] } = useContext(SongsContext)
    const {access_token: [token,,removeToken],
    error: [,setUserError]} = useContext(UserContext);

    // let images = FetchImages({songs, token});
    const [images,setImages] = useState([])
    const fetch = async (work) =>{
        setImages( await FetchImages({songs, token,removeToken,setUserError,work}))
    }
    useEffect(()=>{
        fetch([])
    },[])
    // console.log(images.then((val)=>console.log(val)))
    console.log(images)
    const data = {owner:"Harmonis",type:"public",name:"Top picks",description:"",songs:songs,id:"top_picks", images: images}

    const songToggle = (index) =>{
        if(!songLoaded) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === songs[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(songs[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    return songs.map((song,key) =>
        (<SongCard key={key} song={song} imageUrl={images[key]} songToggle={songToggle} id={key} songs={songs} images={images} data={data}/>)
    )
}