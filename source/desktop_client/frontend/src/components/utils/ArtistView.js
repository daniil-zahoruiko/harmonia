import { useContext, useEffect } from "react"
import { SongsContext } from "../../SongsData"
import { UserContext } from "../../UserContext";
import { FetchImages, UpdateFavArtists } from "../../api";
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { LoadedImage } from './LoadedImage';
import "../../styles/playlistview.css"
import { SongRow } from './SongRow';
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import { AlbumCard } from "./Cards";



export const ArtistView = () =>{
    const { db:[songs,,albums],
            playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            playlistView:[playlistView,setPlaylistView],
            cachedImages:[images,setImages],
            artistRender:[showedArtist,setShowedArtist]} = useContext(SongsContext)

    const {
        access_token: [token,,removeToken],
        error: [,setUserError],
        username:[username,setUsername],
        fav_artists:[favArtists,setFavArtists]
    } = useContext(UserContext);

    const artist_songs = songs.filter(song=>{
        return song.artistId === showedArtist.id
    })

    const artist_albums = albums.filter(album=>{
        return album.artistId === showedArtist.id
    })
    console.log(favArtists)

    const isEmpty = artist_songs.length === 0

    const name = showedArtist.name
    const id = showedArtist.id+"_artist"


    const data = {owner:name,type:"",name:name,description:"",songs:artist_songs,id:id}

    // const images = FetchImages({songs, token});
    const fetch = async (songs) =>{
        await FetchImages({songs:songs, token,removeToken,setUserError,setAllLoaded,images,setImages})
    }


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

    useEffect(()=>{
        setAllLoaded(false)
        fetch(artist_songs)
    },[])



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


    return(
        <div>
            <div className="playlist_header">
                {id==="liked_songs"
                ?<div className="playlist_image liked_playlist_image"><AiFillHeart/></div>
                :<LoadedImage className="playlist_image" src={isEmpty?"none":images[artist_songs[0].id]} />}
                <div className="playlist_data">
                    <p className='playlist_type'>Artist</p>
                    <p className='playlist_name'>{name}</p>
                </div>
            </div>
            <div className="playlist_utils">
                <div className='play_playlist_wrapper'>
                    {isPlaying && currentPlaylist.id === id?<BsFillPauseCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>
                    :<BsFillPlayCircleFill className='play_playlist' color="44489F" onClick={pauseButtonToggle}/>}
                </div>
                {favArtists[showedArtist.id]
                ?<AiFillHeart className='playlist_song_like' onClick={likeArtist}/>
                :<AiOutlineHeart className='playlist_song_like' onClick={likeArtist}/>}
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
                                <p>Title</p>
                            </th>
                            <th>
                                <p>Album</p>
                            </th>
                            <th/>
                            <th>
                                <p>Length</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {artist_songs.map((song,key)=>{
                            return(
                            <SongRow key={key} songs={artist_songs} song={song} songToggle={songToggle} id={key} imageUrl={images[song.id]} playlistId={data.id}/>
                            )
                        })}
                    </tbody>
                </table>
                <h1 className="artist_view_discography">Discography</h1>
                <div className="songs_cards">
                    {artist_albums.map((album,key)=>{
                        return <AlbumCard album={album} key={key}/>
                    })}
                </div>
        </div>
    )
}