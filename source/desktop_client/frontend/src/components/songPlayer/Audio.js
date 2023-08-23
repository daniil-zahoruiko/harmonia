import { useRef, useEffect,useState,useContext } from "react";
import { Player } from "./Player";
import { SongsContext } from "../../SongsData";


export const Audio = () =>{
    const audioElem = useRef(null);

    const { playing:[isPlaying,setIsPlaying],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded]} = useContext(SongsContext)
    const [first,setFirst] = useState(1)
    const [currentSong, setCurrentSong] = useState({"progress":0,"length":0 });

    useEffect(()=>{
        if(!audioElem.current.duration){
            setSongLoaded(false)
        }
    },[currentSongData])

    useEffect(() => {
        setCurrentSong({"progress":0,"length":0 })
        if(first){
            setFirst(0)
        }
        else{
            if(isPlaying){
                audioElem.current.play()
            }
            else{
                setIsPlaying(true)
            }
        }
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

        setCurrentSong({ "progress": ct / duration * 100,"length":duration})

      }

      const onSongLoad = () =>{
        setCurrentSong({...currentSong,"progress":0,"length":audioElem.current.duration})
        setSongLoaded(true)
      }



    return(
        <>
            <audio src={`/api/song/${currentSongData.id}`} onLoadedData={onSongLoad} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player audioElem={audioElem} currentSong={currentSong}/>
        </>
    )
}