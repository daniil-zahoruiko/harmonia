import { useContext, useState } from "react";
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";
import { Link } from "react-router-dom";
import { getValues } from "../helpers";
import { UserContext } from "../../UserContext";
import "../../styles/songcard.css"


export const AlbumCard = ({album}) =>{
    const { db:[songs],
            playlistRender:[,setShowedPlaylist],
            cachedAlbumImages:[albumImages,] } = useContext(SongsContext)


    const album_songs = songs.filter(song=>{
        return song.albumId === album.id
    })


    const albumToggle = ()=>{
        setShowedPlaylist({owner:album.artist,type:"album",name:album.name,description:"",songs:album_songs,id:album.id+"_album"})
    }

    return(
        <Link to="/playlist" onClick={albumToggle} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={album.name} src={albumImages[album.id]}/>
            <h1 className="song_card_title">{album.name}</h1>
        </Link>
    )
}

export const PlaylistCard = ({playlist}) =>{
    const { playlistRender:[,setShowedPlaylist],
            cachedPlaylistImages:[playlistImages,] } = useContext(SongsContext)

    const {
        username:[username]
    } = useContext(UserContext);

    const playlistsToggle = ()=>{
        setShowedPlaylist({owner:username,name:playlist.name,description:"",songs:getValues(playlist.songs),id:playlist.id})
    }

    return(
        <Link to="/playlist" onClick={playlistsToggle} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={playlist.name} src={playlistImages[playlist.id]}/>
            <h1 className="song_card_title">{playlist.name}</h1>
        </Link>
    )
}



export const ArtistCard = ({artist}) =>{
    const { artistRender:[,setShowedArtist],
            cachedArtistImages: [artistImages] } = useContext(SongsContext)



    const artistToggle = ()=>{
        setShowedArtist(artist)
    }

    return(
        <Link to="/artist" onClick={artistToggle} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={artist.name} src={artistImages[artist.id]}/>
            <h1 className="song_card_title">{artist.name}</h1>
        </Link>
    )
}


export const SongCard = ({song, songToggle,id,playlistId,onContextMenu}) => {

    const { db:[,artists,],
        songData:[currentSongData,],
        playlist:[currentPlaylist,],
        playing:[isPlaying,],
        artistRender:[,setShowedArtist],
        cachedAlbumImages:[albumImages,] } = useContext(SongsContext)


    const [hover,setHover] = useState({bool:false,key:""})

    const artistLink = ()=>{
        const song_artist = artists.filter((artist)=>{
          return artist.id === song.artistId
        })
        setShowedArtist(song_artist[0])
      }

    return(
        <div onContextMenu={onContextMenu} onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover({key:song.id,bool:false})} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={song.title} src={albumImages[song.albumId]}/>
            <h1 className="song_card_title">{song.title}</h1>
            <Link to="/artist" onClick={artistLink} className="song_card_artist">{song.artist}</Link>
            {hover.bool && hover.key === song.id
                ?currentSongData.id === song.id && isPlaying && currentPlaylist.id === playlistId
                ?<BsFillPauseCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :<BsFillPlayCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :""
            }
        </div>
    )
}
