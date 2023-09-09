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

    const fetch = async (data, url) =>{
        await FetchImages({data:data, url:url, token,removeToken,setUserError,setAllLoaded,images,setImages});
        setAllLoaded(true);
    }
    useEffect(()=>{
        setAllLoaded(false)
        fetch(results, '/api/song/cover')
    },[])

    console.log(results)


    return (
        <div className="results_list">
            {results.map((result,key)=>{
                return !result.name?<SongResult result={result} count={key} key={key}/>:<ArtistResult result={result} key={key}/>
            })}
        </div>
    );
}