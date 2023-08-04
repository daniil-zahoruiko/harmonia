import React, { useEffect,useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill,BsVolumeUp, BsVolumeMute,BsVolumeDown} from 'react-icons/bs';
import { Loader } from '../Loader';
import '../../styles/player.css';


export const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs, skipped, setSkipped})=> {

  const [volume, setVolume] = useState(1)

  // play/pause music
  const PlayPause = ()=>
  {
    setisplaying(!isplaying);

  }

  // set current time while using range scroller
  const changeRange = (e) =>{
    const value = e.target.value
    audioElem.current.currentTime = value/100 * currentSong.length
  }

  const changeVolume = (e) =>{
    const value = e.target.value
    audioElem.current.volume = value
    setVolume(value)
    console.log(audioElem.current.volume)
  }

  // skip to previous music
  const skipBack = ()=>
  {
    if(audioElem.current.currentTime>3){
      audioElem.current.currentTime = 0;
      return
    }
    const index = songs.findIndex(x=>x.title === currentSong.title);
    if (index === 0)
    {
      setCurrentSong(songs[songs.length - 1])
    }
    else
    {
      setCurrentSong(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
    setSkipped(skipped+1)
  }

  // skip to next music
  const skiptoNext = ()=>
  {
    const index = songs.findIndex(x=>x.title === currentSong.title);

    if (index === songs.length-1)
    {
      setCurrentSong(songs[0])
    }
    else
    {
      setCurrentSong(songs[index + 1])
    }
    audioElem.current.currentTime = 0;
    setSkipped(skipped+1)
    }

  // Start next song after it ends
  useEffect(()=>{
      if(audioElem.current){
        if(audioElem.current.currentTime/currentSong.length*100 === 100){
          skiptoNext()
        }
      }
  })


  // Load loader page until data is loaded
  if(audioElem.current === null) return <Loader/>

  return (
    <div className='player_container'>
      <div className='navigation_wrapper'>
        <div className='player_song_data'>
          <img className='player_cover' alt={currentSong.title} src={`api/artist/${currentSong.id}/cover`} />
          <div className='player_song_text'>
            <p className='player_title'>{currentSong.title}</p>
            <p className='player_artist'>{currentSong.artist}</p>
          </div>
        </div>
        <div className='playlist_timer_wrapper'>
          <p>{Math.round(audioElem.current.currentTime%60)<10?`${Math.floor(audioElem.current.currentTime/60)}:0${Math.floor(audioElem.current.currentTime%60)}`:`${Math.floor(audioElem.current.currentTime/60)}:${Math.floor(audioElem.current.currentTime%60)}`}</p>
          <input
              type="range"
              className='seek_bar'
              value={currentSong.length ? audioElem.current.currentTime/currentSong.length*100 : 0 }
              onChange={changeRange}
              min="0"
              max="100"
              step="0.01"
          />
          <p>{currentSong.length?
          Math.round(currentSong.length%60)<10?`${Math.round(currentSong.length/60)}:0${Math.round(currentSong.length%60)}`:`${Math.round(currentSong.length/60)}:${Math.round(currentSong.length%60)}`
          :"-:--"}</p>
        </div>
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
            step="0.1"
          />
        </div>
        <div className="controls">
          <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack}/>
          {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
          <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>
        </div>
      </div>
    </div>

  )
}
