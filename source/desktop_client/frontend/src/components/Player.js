import React, { useEffect, useRef, useState } from 'react';
import '../styles/player.css';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';

export const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs})=> {
    const [rangeProgress, setRangeProgress] = useState(0)

  const clickRef = useRef();

  const PlayPause = ()=>
  {
    setisplaying(!isplaying);

  }


  const checkWidth = (e)=>
  {
    let width = clickRef.current.clientWidth;
    console.log(width)
    const offset = e.nativeEvent.offsetX;
    console.log(offset)

    const divprogress = offset / width * 100;
    console.log(divprogress)
    audioElem.current.currentTime = divprogress / 100 * currentSong.length;
    console.log(audioElem.current.currentTime)

  }
  const changeRange = (e) =>{
    console.log(e)
    audioElem.current.currentTime = e.target.value/100 * currentSong.length
  }

//   useEffect(()=>{
//     setRangeProgress(audioElem.current.currentTime/currentSong.length*100)
//   },[audioElem.current.currentTime])

  const skipBack = ()=>
  {
    const index = songs.findIndex(x=>x.title == currentSong.title);
    if (index == 0)
    {
      setCurrentSong(songs[songs.length - 1])
    }
    else
    {
      setCurrentSong(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
    if(isplaying){
        setisplaying(!isplaying)
    }
  }


  const skiptoNext = ()=>
  {
    const index = songs.findIndex(x=>x.title == currentSong.title);

    if (index == songs.length-1)
    {
      setCurrentSong(songs[0])
    }
    else
    {
      setCurrentSong(songs[index + 1])
    }
    audioElem.current.currentTime = 0;
    if(isplaying){
        setisplaying(!isplaying)
    }
  }

  if(audioElem.current === null) return <h1>Loading</h1>
  console.log(currentSong)
  console.log(audioElem.current.currentTime/currentSong.length*100 + currentSong.title)

  return (
    <div className='player_container'>
      <div className="title">
        <p>{currentSong.title}</p>
      </div>
      <div className="navigation">
        <div className="navigation_wrapper" onClick={checkWidth} ref={clickRef}>
          {/* <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div> */}
          {console.log(audioElem.current.currentTime, currentSong.length)}
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
