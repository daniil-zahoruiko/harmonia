import React, { useEffect } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';
import { Loader } from '../Loader';
import '../../styles/player.css';


export const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs, skipped, setSkipped})=> {

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

  // skip to previous music
  const skipBack = ()=>
  {
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
      <div className="title">
        <p>{currentSong.title}</p>
      </div>
      <div className="navigation">
        <div className="navigation_wrapper">
          <input
            type="range"
            className='seek_bar'
            value={currentSong.length ? audioElem.current.currentTime/currentSong.length*100 : 0 }
            onChange={changeRange}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>
      <div className="controls">
        <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
        <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>
      </div>
    </div>

  )
}
