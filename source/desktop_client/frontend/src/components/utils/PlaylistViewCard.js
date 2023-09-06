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
        toggles:[PlayPause],
        displayLoad:[allLoaded,setAllLoaded],
        cachedImages:[images,setImages] } = useContext(SongsContext)
    const {access_token: [token,,removeToken],
    error: [,setUserError]} = useContext(UserContext);

    // let images = FetchImages({songs, token, removeToken, setUserError});
    const fetch = async (songs) =>{
        console.log("I called")
        await FetchImages({songs:songs, token,removeToken,setUserError,setAllLoaded,images,setImages})
        // setImages(fetchedImages)
    }
    useEffect(()=>{
        setAllLoaded(false)
        fetch(songs)
    },[])
    // const fetch = async (songs) =>{
    //     console.log("I called")
    //     const fetchedImages = await FetchImages({songs:songs, token,removeToken,setUserError,setAllLoaded})
    //     setImages(fetchedImages)
    // }
    // useEffect(()=>{
    //     console.log("called",songs)
    //     fetch(songs)
    // },[allLoaded])
    // console.log(images.then((val)=>console.log(val)))
    console.log(images)
    const data = {owner:"Harmonis",type:"public",name:"Top picks",description:"",songs:songs,id:"top_picks"}

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
        (<SongCard key={key} song={song} imageUrl={images[song.id]} songToggle={songToggle} id={key} playlistId={data.id}/>)
    )
}