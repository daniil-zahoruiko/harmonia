import { useContext, useEffect, useRef, useState } from "react"
import { SongsContext } from "../../SongsData"
import { UserContext } from "../../UserContext";
import { FetchImages, UpdateFavArtists } from "../../api";
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from './LoadedImage';
import "../../styles/playlistview.css"
import { SongRow } from './SongRow';
import {AiFillHeart} from "react-icons/ai"
import { AlbumCard } from "./Cards";
import { ContextMenu } from "./ContextMenu";
import { useTranslation } from "react-i18next";



export const ArtistView = () =>{
    const { db:[songs,,albums],
            playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            cachedArtistImages:[artistImages, setArtistImages],
            cachedAlbumImages:[albumImages, setAlbumImages],
            artistRender:[showedArtist]} = useContext(SongsContext)

    const {
        access_token: [token,,refreshToken,removeToken],
        error: [,setUserError],
        username:[username],
        fav_artists:[favArtists,setFavArtists]
    } = useContext(UserContext);

    const [t,] = useTranslation("playlist")

    const artist_songs = songs.filter(song=>{
        return song.artistId === showedArtist.id
    })

    const artist_albums = albums.filter(album=>{
        return album.artistId === showedArtist.id
    })

    const isEmpty = artist_songs.length === 0

    const name = showedArtist.name
    const id = showedArtist.id+"_artist"

    const firstRender = useRef(true)


    const data = {owner:name,type:"",name:name,description:"",songs:artist_songs,id:id}


    const albumIdsSet = new Set(artist_songs.map((song)=>{
        return song.albumId
    }))

    artist_albums.forEach(album => {
        albumIdsSet.add(album.id)
    });

    const albumsToFetch = albums.filter((album,key)=>{
        return albumIdsSet.has(album.id)
    })

    const fetch = async (data, url, images, setImages,last) =>{
        await FetchImages({data:data,url:url, token,removeToken,refreshToken,setUserError,setAllLoaded,images,setImages})
        if(last){
            setAllLoaded(true)
        }
    }

    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }else{
            setAllLoaded(false)
            fetch([showedArtist], "/api/artist/cover", artistImages, setArtistImages);
            fetch(albumsToFetch, "/api/album/cover", albumImages, setAlbumImages,true);

        }
    },[])


    const likeArtist = () =>{
        var keys = Object.keys(favArtists)
        let temp_dict = {...favArtists}
        if(!keys.includes(showedArtist.id)){
            temp_dict[showedArtist.id] = showedArtist
            setFavArtists(temp_dict)
        }
        else{
            delete temp_dict[showedArtist.id]
            setFavArtists(temp_dict)
        }
        UpdateFavArtists({token:token,username:username,favArtists:temp_dict})
    }



    // play/pause button functionality
    const pauseButtonToggle = () =>{
        if(isEmpty) return
        if(currentPlaylist.id !== id){
            setSongLoaded(false)
            setCurrentPlaylist(data)
            setCurrentSongData(artist_songs[0])
            if(!isPlaying) setIsPlaying(true)
        }
        else{
            PlayPause()
        }
    }
    const songToggle = (index) =>{
        if(!songLoaded || isEmpty) return
        if(currentPlaylist.id !== data.id){
            setCurrentPlaylist(data)
        }
        if(currentSongData === artist_songs[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(artist_songs[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    const [activated,setActivated] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const [contextId,setContextId] = useState(0)

    const handleClick = (e,value) => {
        setTop(e.pageY)
        setLeft(e.pageX)
        setActivated(true)
        setContextId(value)
    }

    let total_streams = 0

    artist_songs.forEach(song => {
        total_streams+=parseInt(song.streams)
    });


    return(
        <div>
            <div className="playlist_header">
                {id==="liked_songs"
                ?<div className="playlist_image liked_playlist_image"><AiFillHeart/></div>
                :<LoadedImage className="playlist_image" src={isEmpty?"none":artistImages[showedArtist.id]} />}
                <div className="playlist_data">
                    <p className='playlist_type'>{t("artist")}</p>
                    <p className='playlist_name'>{name}</p>
                    <p className='playlist_description'>{t("total_streams")}: {total_streams}</p>
                </div>
            </div>
            <div className="playlist_utils">
                <div className='play_playlist_wrapper'>
                    {isPlaying && currentPlaylist.id === id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>
                    :<BsFillPlayCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>}
                </div>
                <button
                    className="artist_follow_button"
                    onClick={likeArtist}>{favArtists[showedArtist.id]
                        ?t("following")
                        :t("follow")}
                </button>
            </div>
                <table className='songs_list'>
                    <colgroup>
                        <col className='n_col'/>
                        <col className='title_col'/>
                        <col className='album_col'/>
                        <col/>
                        <col className='time_col'/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                <p>#</p>
                            </th>
                            <th>
                                <p>{t("title")}</p>
                            </th>
                            <th>
                                <p>{t("album")}</p>
                            </th>
                            <th>
                                {t("streams")}
                            </th>
                            <th/>
                            <th>
                                <p>{t("length")}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {artist_songs.map((song,key)=>{
                            return(
                            <SongRow
                                type="artist"
                                onContextMenu={(e) =>handleClick(e,key)}
                                key={key} songs={artist_songs}
                                song={song}
                                songToggle={songToggle}
                                id={key}
                                imageUrl={albumImages[song.albumId]}
                                playlistId={data.id}
                            />
                            )
                        })}
                    </tbody>
                </table>
                <ContextMenu song={artist_songs[contextId]} activated={activated} setActivated={setActivated} top={top} left={left}/>
                <h1 className="artist_view_discography">{t("discography")}</h1>
                <div className="songs_cards">
                    {artist_albums.map((album,key)=>{
                        return <AlbumCard album={album} key={key}/>
                    })}
                </div>
        </div>
    )
}