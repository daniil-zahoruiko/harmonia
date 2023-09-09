import { useContext, useState } from "react";
import "../../styles/songcard.css"
import { LoadedImage } from "./LoadedImage"
import {BsFillPlayCircleFill, BsFillPauseCircleFill} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";


export const AlbumCard = ({album}) =>{
    const { db:[songs],
            page:[,setCurrentPage],
            playlistRender:[,setShowedPlaylist],
            cachedAlbumImages:[albumImages,] } = useContext(SongsContext)


    const album_songs = songs.filter(song=>{
        return song.albumId === album.id
    })



    const albumToggle = ()=>{
        setShowedPlaylist({owner:"",type:"album",name:album.name,description:"",songs:album_songs,id:album.id+"_album"})
        setCurrentPage("playlist-view")
    }

    return(
        <div onClick={albumToggle} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={album.name} src={albumImages[album.id]}/>
            <h1 className="song_card_title">{album.name}</h1>
        </div>
    )
}



export const ArtistCard = ({artist}) =>{
    const { artistRender:[,setShowedArtist],
            page:[,setCurrentPage],
            cachedArtistImages: [artistImages,] } = useContext(SongsContext)



    const artistToggle = ()=>{
        setShowedArtist(artist)
        setCurrentPage("artist-view")
    }

    console.log(artistImages);
    return(
        <div onClick={artistToggle} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={artist.name} src={artistImages[artist.id]}/>
            <h1 className="song_card_title">{artist.name}</h1>
        </div>
    )
}


export const SongCard = ({song, imageUrl,songToggle,id,playlistId}) => {

    const { db:[,artists,],
        songData:[currentSongData,],
        playlist:[currentPlaylist,],
        playing:[isPlaying,],
        artistRender:[,setShowedArtist],
        page:[,setCurrentPage] } = useContext(SongsContext)


    const [hover,setHover] = useState({bool:false,key:""})

    const artistLink = ()=>{
        const song_artist = artists.filter((artist)=>{
          return artist.id === song.artistId
        })
        setShowedArtist(song_artist[0])
        setCurrentPage("artist-view")
      }

    return(
        <div onMouseEnter={()=>setHover({bool:true,key:song.id})} onMouseLeave={()=>setHover({key:song.id,bool:false})} className="SongCard">
            <LoadedImage className={"songcard_img"} alt={song.title} src={imageUrl}/>
            <h1 className="song_card_title">{song.title}</h1>
            <p onClick={artistLink} className="song_card_artist">{song.artist}</p>
            {hover.bool && hover.key === song.id
                ?currentSongData.id === song.id && isPlaying && currentPlaylist.id === playlistId
                ?<BsFillPauseCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :<BsFillPlayCircleFill className={`song_card_play ${hover.bool?"do_animation":""}`} onClick={()=>songToggle(id)}/>
                :""
            }
        </div>
    )
}
