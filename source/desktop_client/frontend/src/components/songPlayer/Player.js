import { useEffect,useState,useContext } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill,BsVolumeUp, BsVolumeMute,BsVolumeDown} from 'react-icons/bs';
import { Loader } from '../utils/Loader';
import { SongsContext } from "../../SongsData";
import '../../styles/player.css';

export const Player = ({audioElem, currentSong})=> {

  const { playlist:[currentPlaylist,],
          playing:[isPlaying, setIsPlaying],
          songData:[currentSongData,setCurrentSongData],
          song:[songLoaded, setSongLoaded],
          toggles:[PlayPause] } = useContext(SongsContext)

  const [volume, setVolume] = useState(1)
  const [slider,setSlider] = useState(currentSong.progress)
  const [clicked, setClicked] = useState(false)

  const songs = currentPlaylist.songs

  // set current time while using range scroller
  const changeRange = (e) =>{
    const value = e.target.value
    const res = value/100 * currentSong.length
      audioElem.current.currentTime = res
      setClicked(false)
  }


  const changeVolume = (e) =>{
    const value = e.target.value
    audioElem.current.volume = value
    setVolume(value)
  }

  // skip to previous music
  const skipBack = ()=>{
    if(!songLoaded) return

    if(audioElem.current.currentTime>3){
      audioElem.current.currentTime = 0;
      return
    }

    const index = songs.findIndex(x=>x.title === currentSongData.title);
    if (index === 0)
    {
      setCurrentSongData(songs[songs.length - 1])
    }
    else
    {
      setCurrentSongData(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
  }

  // skip to next music
  const skiptoNext =()=>{
    if(!songLoaded) return

    const index = songs.findIndex(x=>x.title === currentSongData.title);

    if (index === songs.length-1)
    {
      setCurrentSongData(songs[0])
    }
    else
    {
      setCurrentSongData(songs[index + 1])
    }
    //audioElem.current.currentTime = 0;
  }

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

  useEffect(()=>{
    if(!clicked){
      setSlider(currentSong.progress)
    }
  },[currentSong])

  // // Load loader page until data is loaded
  if(audioElem.current === null) return <Loader/>

  return (
    <div className='player_container'>
      <div className='navigation_wrapper'>
        <div className='player_song_data'>
          <img className='player_cover' alt={currentSongData.title} src={`api/artist/${currentSongData.id}/cover`} />
          <div className='player_song_text'>
            <p className='player_title'>{currentSongData.title}</p>
            <p className='player_artist'>{currentSongData.artist}</p>
          </div>
        </div>
        {/*-------------------------------------------------------------
        --------------------------SONG RANGE SLIDER BAR-------------------
        -------------------------------------------------------------*/}
        <div className='playlist_timer_wrapper'>
          <p>{!currentSong.progress?"0:00":Math.floor(slider/100 * currentSong.length%60)<10
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
          <p>{currentSong.length?
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
