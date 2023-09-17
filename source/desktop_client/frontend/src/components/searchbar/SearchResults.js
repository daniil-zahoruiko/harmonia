import { useCallback, useContext, useEffect, useRef, useState } from "react"
import "../../styles/searchresults.css"
import { SongsContext } from "../../SongsData"
import { FetchImages } from "../../api"
import { UserContext } from "../../UserContext"
import { SongResult, ArtistResult, AlbumResult } from "./ResultViews"
import { AlbumCard } from "../utils/Cards"
import { ContextMenu } from "../utils/ContextMenu"

export const SearchResults = ({results}) => {
    const { displayLoad:[,setAllLoaded],
            cachedArtistImages:[artistImages, setArtistImages],
            cachedAlbumImages: [albumImages, setAlbumImages],
            db:[,,albums] } = useContext(SongsContext)

    const { access_token: [token,,refreshToken,removeToken],
        error: [,setUserError]  } = useContext(UserContext);

    const firstRender = useRef(true)

    const [activated,setActivated] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const [contextId,setContextId] = useState(0)


    const albumIdsSet = new Set(results["songs"].map((song)=>{
        return song.albumId
    }))

    results["albums"].forEach(album => {
        albumIdsSet.add(album.id)
    });

    const albumsToFetch = albums.filter((album,key)=>{
        return albumIdsSet.has(album.id)
    })



    const fetch = async (data, url, images, setImages) =>{
        await FetchImages({data:data, url:url, token,removeToken,refreshToken,setUserError,setAllLoaded,images:images,setImages:setImages});
        setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }else{
            setAllLoaded(false)
            // fetch(results["songs"], '/api/song/cover', songImages, setSongImages)
            fetch(results["artists"], '/api/artist/cover', artistImages, setArtistImages)
            fetch(albumsToFetch, '/api/album/cover', albumImages, setAlbumImages)
        }
    },[])

    const handleClick = (e,value) => {
        setTop(e.pageY)
        setLeft(e.pageX)
        setActivated(true)
        setContextId(value)
    }


    return (
        <div className="results_list">
            {results["artists"].map((result, key)=>{
                return <ArtistResult result={result} key={key}/>
            })}
            {results["albums"].map((result, key) => {
                return <AlbumResult result={result} key={key}/>
            })}
            {results["songs"].map((result, key)=>{
                return <SongResult onClick={(e) =>handleClick(e,key)} result={result} count={key} key={key}/>
            })}
            <ContextMenu song={results["songs"][contextId]} activated={activated} setActivated={setActivated} top={top} left={left}/>
        </div>
    );
}