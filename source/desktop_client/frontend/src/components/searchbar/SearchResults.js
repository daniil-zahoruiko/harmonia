import { useCallback, useContext, useEffect, useRef, useState } from "react"
import "../../styles/searchresults.css"
import { SongsContext } from "../../SongsData"
import { FetchImages } from "../../api"
import { UserContext } from "../../UserContext"
import { SongResult, ArtistResult, AlbumResult } from "./ResultViews"
import { AlbumCard } from "../utils/Cards"

export const SearchResults = ({results}) => {
    const { displayLoad:[,setAllLoaded],
            cachedSongImages:[songImages,setSongImages],
            cachedArtistImages:[artistImages, setArtistImages],
            cachedAlbumImages: [albumImages, setAlbumImages] } = useContext(SongsContext)

    const { access_token: [token,,removeToken],
        error: [,setUserError]  } = useContext(UserContext);

    const firstRender = useRef(true)

    // const data = {owner:"Harmonia",type:"public",name:"Search",description:"",songs:songs,id:"search"}

    const fetch = async (data, url, images, setImages) =>{
        await FetchImages({data:data, url:url, token,removeToken,setUserError,setAllLoaded,images:images,setImages:setImages});
        setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }else{
            setAllLoaded(false)
            fetch(results["songs"], '/api/song/cover', songImages, setSongImages)
            fetch(results["artists"], '/api/artist/cover', artistImages, setArtistImages)
            fetch(results["albums"], '/api/album/cover', albumImages, setAlbumImages)
        }
    },[])


    return (
        <div className="results_list">
            {results["artists"].map((result, key)=>{
                return <ArtistResult result={result} key={key}/>
            })}
            {results["albums"].map((result, key) => {
                return <AlbumResult result={result} key={key}/>
            })}
            {results["songs"].map((result, key)=>{
                return <SongResult result={result} count={key} key={key}/>
            })}
        </div>
    );
}