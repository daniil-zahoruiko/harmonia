import { useRef, useEffect,useState } from "react";
import { Player } from "./Player";


export const Audio = (songs, setSongs) =>{
    const audioElem = useRef(null);

    const [skipped,setSkipped] = useState(0)
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState({...songs.songs[1], "progress":0,"length":0 });
    console.log(currentSong,{...songs.songs[1]})

    // set second song from list by default ?(delete soon)
    useEffect(()=>{
        if(!songs){
            setCurrentSong(songs[1])
        }
    },[songs])

    // if play/pause button pressed play/pause music
    useEffect(() => {
        if(audioElem.current){
            if (isplaying) {
                audioElem.current.play();
                }
            else {
                audioElem.current.pause();
            }
        }
      }, [isplaying])

    // play song by default after skip (exlcuding first load)
    useEffect(()=>{
        if(isplaying === true){
            audioElem.current.play()
        }
        else if(skipped !== 0){
            setisplaying(true)
        }
      }, [skipped])

    // fill in current song length after it is loaded
    useEffect(()=>{
        if(audioElem.current.duration){
            setCurrentSong({...currentSong,"length":audioElem.current.duration})
        }
    },[audioElem.current])

    // on time update after using range scroll
    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })

      }

    return(
        <>
            <audio src={`/song/${currentSong.file}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player songs={songs.songs} setSongs={setSongs} isplaying={isplaying} setisplaying={setisplaying} audioElem={audioElem}
             currentSong={currentSong} setCurrentSong={setCurrentSong} skipped={skipped} setSkipped={setSkipped}/>
        </>
    )
}