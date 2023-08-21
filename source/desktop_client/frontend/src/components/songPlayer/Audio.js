import { useRef, useEffect,useState } from "react";
import { Player } from "./Player";


export const Audio = ({songs,setCurrentIndex,currentIndex}) =>{
    const audioElem = useRef(null);

    const [isplaying, setisplaying] = useState(false);
    const [first,setFirst] = useState(1)
    const [currentSong, setCurrentSong] = useState({...songs[0], "progress":0,"length":0 });



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

    // fill in current song length after it is loaded
    // useEffect(()=>{
    //     if(audioElem.current.duration){
    //         setCurrentSong({...currentSong,"length":audioElem.current.duration})
    //     }
    // },[audioElem.current])

    // on time update after using range scroll
    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ ...currentSong, "progress": ct / duration * 100,"length":duration})

      }

    useEffect(()=>{
        if(first){
            setFirst(0)
        }
        else{
            if(isplaying === true){
                audioElem.current.play()
            }
            else{
                setisplaying(true)
            }
        }


        if(audioElem.current.duration){
            setCurrentSong({...currentSong,"length":audioElem.current.duration})
        }
    },[currentSong.file])


    return(
        <>
            <audio src={`/api/song/${currentSong.id}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player songs={songs} isplaying={isplaying} setisplaying={setisplaying} audioElem={audioElem}
             currentSong={currentSong} setCurrentSong={setCurrentSong} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </>
    )
}