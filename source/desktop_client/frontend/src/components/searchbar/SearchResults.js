import { useCallback, useContext, useEffect, useState } from "react"
import "../../styles/searchresults.css"
import { SongsContext } from "../../SongsData"
import { FetchImages } from "../../api"
import { UserContext } from "../../UserContext"
import { SongResult } from "./SongResult"
import { ArtistResult } from "./ArtistResult"

export const SearchResults = ({results}) => {
    const { displayLoad:[,setAllLoaded],
            cachedImages:[images,setImages] } = useContext(SongsContext)

    const { access_token: [token,,removeToken],
        error: [,setUserError]  } = useContext(UserContext);

    // const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:songs,id:"search"}

    const fetch = async (songs) =>{
        await FetchImages({songs:songs, token,removeToken,setUserError,setAllLoaded,images,setImages})
    }
    useEffect(()=>{
        setAllLoaded(false)
        fetch(results)
    },[])

    // song onclick functionality
    // const songToggle = (index) =>{
    //     if(!songLoaded) return
    //     if(currentPlaylist.id !== data.id){
    //         setCurrentPlaylist(data)
    //     }
    //     if(currentSongData === songs[index]){
    //         PlayPause()
    //     }
    //     else{
    //         setSongLoaded(false)
    //         setCurrentSongData(songs[index])
    //         if(!isPlaying) setIsPlaying(true)
    //     }
    // }


    return (
        <div className="results_list">
            {results.map((result,key)=>{
                return !result.name?<SongResult result={result} count={key} key={key}/>:<ArtistResult result={result} key={key}/>
            })}
        </div>
    );
}