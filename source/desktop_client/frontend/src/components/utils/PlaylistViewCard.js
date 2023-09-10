import { useContext, useEffect, useRef } from "react"
import { UserContext } from "../../UserContext"
import { ArtistCard, SongCard } from "./Cards"; 
import { SongsContext } from "../../SongsData";
import { FetchImages } from "../../api";

export const TopPicks = ({songs}) =>
{
    const { playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            cachedSongImages:[images,setImages] } = useContext(SongsContext)

    const {access_token: [token,,removeToken],
    error: [,setUserError]} = useContext(UserContext);

    const firstRender = useRef(true)

    const fetch = async (data, url) =>{
        await FetchImages({data:data, url: url, token,removeToken,setUserError,setAllLoaded,images,setImages});
        setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }
        else{
            setAllLoaded(false)
            fetch(songs, '/api/song/cover')
        }
    },[])

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


export const FavArtists = () =>{
    const {
        access_token: [token,,removeToken],
        error: [,setUserError],
        username:[username,],
        fav_artists:[favArtists,]
    } = useContext(UserContext);

    const {
        cachedArtistImages:[images, setImages],
        displayLoad:[,setAllLoaded]
    } = useContext(SongsContext);

    const artists = Object.keys(favArtists).map((key)=>{return favArtists[key]})

    const firstRender = useRef(true);

    const fetch = async (data, url) =>{
        await FetchImages({data:data,url:url, token,removeToken,setUserError,setAllLoaded,images,setImages})
        setAllLoaded(true)
        console.log(favArtists);
    }

    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }else{
            setAllLoaded(false)
            fetch(Object.keys(favArtists).map((key)=>{return favArtists[key]}), "/api/artist/cover");
        }
    },[])

    return(
        <div>
            <div className="playlist_header">
                <div className="playlist_image liked_playlist_image">
                    <svg className="lb_svg" xmlns="http://www.w3.org/2000/svg" width="33" height="44" viewBox="0 0 33 44" fill="none">
                        <path d="M16.3219 13.5507L6.11435 29.0662C5.8079 29.532 6.02287 30.1743 6.54327 30.3478C6.82524 30.4418 7.13345 30.3707 7.3488 30.1621L20.5872 17.3374C21.8521 16.112 21.7494 13.9995 20.3712 12.897C19.0847 11.8677 17.2324 12.1668 16.3219 13.5507Z" stroke="white" strokeWidth="3"/>
                        <path d="M24.5 2C28.0899 2 31 4.91015 31 8.5C31 12.0899 28.0899 15 24.5 15C20.9101 15 18 12.0899 18 8.5C18 4.91015 20.9101 2 24.5 2Z" stroke="white" strokeWidth="3"/>
                        <path d="M6.01113 30.3333V30.3333C5.4794 30.7797 5.82833 31.6944 6.51301 31.8092C7.58121 31.9882 8.20464 32.4344 6.93235 33.3956C6.18219 33.9623 5.3606 34.5585 4.56849 35.1213C2.36114 36.6895 -1.06878 38.891 1.01972 40.6143C1.08326 40.6667 1.15023 40.7196 1.22077 40.7729C1.27488 40.8138 1.32726 40.8534 1.37796 40.8918C2.55965 41.7871 1.33738 42.1607 0.115299 43V43" stroke="white" strokeWidth="0.4"/>
                    </svg>
                </div>
                <div className="playlist_data">
                    <p className='playlist_type'></p>
                    <p className='playlist_name'>Favorite Artists</p>
                    <p className='playlist_description'>List of your favorite artists</p>
                    <p className='playlist_owner'>#{username}</p>
                </div>
            </div>
            <div className='songs_cards'>
                {artists.map((artist,key)=>{
                    return(
                        <ArtistCard artist={artist} key={key}/>
                    )
                })}
            </div>
        </div>
    )
}