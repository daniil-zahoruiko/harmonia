import { useEffect,useState,useContext } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill,BsVolumeUp, BsVolumeMute,BsVolumeDown} from 'react-icons/bs';
import { SongsContext } from "../../SongsData";
import '../../styles/player.css';
import { UserContext } from '../../UserContext';
import { AddStreams, FetchImage } from '../../api';
import {AiOutlineHeart,AiFillHeart} from "react-icons/ai"
import { UpdateLikedSongs } from "../../api";

export const Player = ({audioElem, currentSong})=> {

  const { db:[,artists,],
          playlist:[currentPlaylist,],
          playing:[isPlaying, setIsPlaying],
          songData:[currentSongData,setCurrentSongData],
          song:[songLoaded, setSongLoaded],
          toggles:[PlayPause],
          artistRender:[,setShowedArtist],
          page:[,setCurrentPage] } = useContext(SongsContext)

  const { access_token: [token, , removeToken],
          error: [, setUserError],
          username:[username,],
          liked_songs:[likedSongs,setLikedSongs] } = useContext(UserContext);

  const [volume, setVolume] = useState(1)
  const [slider,setSlider] = useState(currentSong.progress)
  const [clicked, setClicked] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const likeSong = () =>{
    var keys = Object.keys(likedSongs)
    let temp_dict = {...likedSongs}
    if(!keys.includes(currentSongData.id)){
      temp_dict[currentSongData.id] = currentSongData
        setLikedSongs(temp_dict)
    }
    else{
        delete temp_dict[currentSongData.id]
        setLikedSongs(temp_dict)
    }
    UpdateLikedSongs({token:token,username:username,likedSongs:temp_dict})
}

  const songs = currentPlaylist.songs

  const artistLink = ()=>{
    const song_artist = artists.filter((artist)=>{
      return artist.id === currentSongData.artistId
    })
    setShowedArtist(song_artist[0])
    setCurrentPage("artist-view")
  }

  // set current time while using range scroller(when unclicked/submitted cur time)
  const changeRange = (e) =>{
    const value = e.target.value
    const res = value/100 * currentSong.length
      audioElem.current.currentTime = res
      setClicked(false)
  }

  // change volume
  const changeVolume = (e) =>{
    const value = e.target.value
    audioElem.current.volume = value
    setVolume(value)
  }

  // skip to previous music
  const skipBack = ()=>{
    if(!songLoaded) return

    if(!isPlaying) setIsPlaying(true)

    if(audioElem.current.currentTime>3){
      audioElem.current.currentTime = 0;
      return
    }

    var index = songs.findIndex(x=>x.id === currentSongData.id);

    if (index === 0)
    {
      index = songs.length;
    }

    setCurrentSongData(songs[index - 1]);
    setSongLoaded(false)
  }

  // skip to next music
  const skiptoNext =()=>{
    if(!songLoaded) return

    if(!isPlaying) setIsPlaying(true)

    var index = songs.findIndex(x=>x.id === currentSongData.id) + 1;

    if (index === songs.length)
    {
      index = 0;
    }
    if(currentSong.progress*currentSong.length/100 > 30){
      AddStreams({token:token,streams:currentSongData.streams+1,song_id:currentSongData.id})
    }
    setCurrentSongData(songs[index]);
    setSongLoaded(false)
  }

  // change slider position(without changing the actual song position)
  const toggle = (e) =>{
    setClicked(true)
    setSlider(e.target.value)
  }

    // Start next song after it ends
  useEffect(()=>{
    if(audioElem.current){
      if(audioElem.current.currentTime/currentSong.length*100 === 100){
        skiptoNext()
      }
    }
  })

  // change song range slider accordingly to the song progress
  useEffect(()=>{
    if(!clicked){
      setSlider(currentSong.progress)
    }
  },[currentSong])

  useEffect(() =>
  {
    FetchImage({url:`/api/song/cover/${currentSongData.id}`, token: token, removeToken: removeToken, setUserError: setUserError}).then((res) => setImageUrl(res));
  }, [currentSongData,songLoaded])

  return (
    <div className='player_container'>
      <div className='navigation_wrapper'>
        <div className='player_song_data'>
          <img className='player_cover' alt={currentSongData.title} src={imageUrl} />
          <div onClick={artistLink} className='player_song_text'>
            <p className='player_title'>{currentSongData.title}</p>
            <p className='player_artist'>{currentSongData.artist}</p>
          </div>
            {likedSongs[currentSongData.id]?<AiFillHeart className='player_like' onClick={likeSong}/>:<AiOutlineHeart className='player_like' onClick={likeSong}/>}
        </div>
        {/*-------------------------------------------------------------
        --------------------------SONG RANGE SLIDER BAR-------------------
        -------------------------------------------------------------*/}
        <div className='playlist_timer_wrapper'>
          <p>{!songLoaded || !slider?"0:00":Math.floor(slider/100 * currentSong.length%60)<10
          ?`${Math.floor(slider/100 * currentSong.length/60)}:0${Math.floor(slider/100 * currentSong.length%60)}`
          :`${Math.floor(slider/100 * currentSong.length/60)}:${Math.floor(slider/100 * currentSong.length%60)}`}</p>
          <input
              type="range"
              className='seek_bar'
              value={slider?slider:0}
              onChange={toggle}
              min="0"
              max="100"
              step="0.01"
              onClickCapture={changeRange}
          />
          <p>{songLoaded?
          Math.floor(currentSong.length%60)<10?`${Math.floor(currentSong.length/60)}:0${Math.floor(currentSong.length%60)}`:`${Math.floor(currentSong.length/60)}:${Math.floor(currentSong.length%60)}`
          :"-:--"}</p>
        </div>
        {/*-------------------------------------------------------------
        --------------------------VOLUME SLIDER BAR-------------------
        -------------------------------------------------------------*/}
        <div className='playlist_sound_wrapper'>
          {volume>0.7?<BsVolumeUp className='playlist_volume_svg'/>
          :volume>0?<BsVolumeDown className='playlist_volume_svg'/>
          :<BsVolumeMute className='playlist_volume_svg'/>}
          <input
            type="range"
            className='volume_bar'
            value={volume}
            onChange={changeVolume}
            min="0"
            max="1"
            step="0.01"
          />
        </div>
        <div className="controls">
          <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack}/>
          {isPlaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
          <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>
        </div>
      </div>
    </div>

  )
}
