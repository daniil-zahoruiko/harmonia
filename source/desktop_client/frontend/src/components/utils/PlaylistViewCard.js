import { useContext, useState } from "react"
import { UserContext } from "../../UserContext"
import { FetchImages } from "../../api";
import { SongCard } from "./SongCard";
import { SongsContext } from "../../SongsData";

export const TopPicks = ({songs}) =>
{
    const {access_token: [token,,]} = useContext(UserContext);
    const {   playing:[isPlaying,setIsPlaying],
        playlist:[currentPlaylist,setCurrentPlaylist],
        songData:[currentSongData,setCurrentSongData],
        song:[songLoaded, setSongLoaded],
        toggles:[PlayPause] } = useContext(SongsContext)

    const images = FetchImages({songs, token});
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