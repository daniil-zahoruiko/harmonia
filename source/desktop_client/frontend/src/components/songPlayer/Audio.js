import { useRef, useEffect,useState,useContext } from "react";
import { Player } from "./Player";
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";


export const Audio = () =>{
    const audioElem = useRef(null);

    const { playing:[isPlaying,setIsPlaying],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded]} = useContext(SongsContext);
    
    const {access_token:[token,,]} = useContext(UserContext);
    
    const [first,setFirst] = useState(1)
    const [currentSong, setCurrentSong] = useState({"progress":0,"length":0 });
    const [songUrl, setSongUrl] = useState("");

    // useEffect(()=>{
    //     setSongLoaded(false)
    // },[currentSongData])

    useEffect(() => {
        if(audioElem.current && !first){
            if (isPlaying && songLoaded) {
                audioElem.current.play();
                }
            else {
                audioElem.current.pause();
            }
        }
      }, [isPlaying])

    useEffect(() => {
        setSongLoaded(false)
        setCurrentSong({"progress":0,"length":0 })
        fetch(`/api/song/${currentSongData.id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'blob',
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => res.blob())
        .then((data) => {
            setSongUrl(URL.createObjectURL(data));
            console.log("url loaded",songLoaded)
        })
      }, [currentSongData])

      useEffect(()=>{
        if(first){
            console.log("changed 1")
            setFirst(0)
        }
        else if(songLoaded){
            console.log("changed end")
            if(isPlaying){
                audioElem.current.play()
            }
            else{
                setIsPlaying(true)
            }
        }
      },[songLoaded])

    // on time update after using range scroll
    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ "progress": ct / duration * 100,"length":duration})
      }

      const onSongLoad = () =>{
        setCurrentSong({...currentSong,"progress":0,"length":audioElem.current.duration})
        console.log("song loaded in")
        setSongLoaded(true)
      }



    return(
        <>
            <audio src={songUrl} onLoadedData={onSongLoad} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player audioElem={audioElem} currentSong={currentSong}/>
        </>
    )
}