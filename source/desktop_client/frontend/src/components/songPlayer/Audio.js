import { useRef, useEffect,useState,useContext, useCallback } from "react";
import { Player } from "./Player";
import { SongsContext } from "../../SongsData";
import { UserContext } from "../../UserContext";


export const Audio = () =>{
    const audioElem = useRef(null);

    const { playing:[isPlaying,],
            songData:[currentSongData,],
            song:[songLoaded, setSongLoaded],
        playlist:[currentPlaylist,setCurrentPlaylist]} = useContext(SongsContext);

    const {access_token:[token,,]} = useContext(UserContext);

    const [currentSong, setCurrentSong] = useState({"progress":0,"length":0 });
    const [songUrl, setSongUrl] = useState("");

    // trigger song play
    useEffect(() => {
        if(audioElem.current){
            if (isPlaying && songLoaded) {
                audioElem.current.play();
                }
            else {
                audioElem.current.pause();
            }
        }
        }, [isPlaying,songLoaded])

    // fetch song
    useEffect(() => {
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
        })
      }, [currentSongData,token,currentPlaylist])

    // on time update after using range scroll
    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ ...currentSong,"progress": ct / duration * 100})
      }

    // when song is loaded
    const onSongLoad = () =>{
        setCurrentSong({"progress":0,"length":audioElem.current.duration})
        setSongLoaded(true)
    }



    return(
        <>
            <audio src={songUrl} onLoadedData={onSongLoad} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player audioElem={audioElem} currentSong={currentSong}/>
        </>
    )
}