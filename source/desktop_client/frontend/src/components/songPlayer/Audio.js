import { useRef, useEffect,useState } from "react";
import { Player } from "./Player";
import { SongsContext } from "../../SongsData";
import React from "react";
import { Loader } from "../utils/Loader";


export const Audio = () =>{
    const audioElem = useRef(null);

    const {playing:[isPlaying,setIsPlaying]} = React.useContext(SongsContext)
    const {songData:[currentSongData,setCurrentSongData]} = React.useContext(SongsContext)
    const [first,setFirst] = useState(1)
    const [currentSong, setCurrentSong] = useState({...currentSongData, "progress":0,"length":0 });

    console.log(currentSongData)

    useEffect(() => {
        console.log("changed")
        setCurrentSong({...currentSongData, "progress":0,"length":0 })
        console.log(currentSongData)
        console.log(currentSong)
      }, [currentSongData])




    // if play/pause button pressed play/pause music
    useEffect(() => {
        if(audioElem.current){
            if (isPlaying) {
                audioElem.current.play();
                }
            else {
                audioElem.current.pause();
            }
        }
      }, [isPlaying])

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
        console.log("I am gay")
        if(first){
            setFirst(0)
        }
        else{
            if(isPlaying === true){
                audioElem.current.play()
            }
            else{
                setIsPlaying(true)
            }
        }


        if(audioElem.current.duration){
            setCurrentSong({...currentSong,"length":audioElem.current.duration})
        }
    },[currentSongData])


    return(
        <>
            <audio src={`/api/song/${currentSongData.id}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player audioElem={audioElem}
             currentSong={currentSong} setCurrentSong={setCurrentSong} />
        </>
    )
}