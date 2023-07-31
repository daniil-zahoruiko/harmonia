import React, { useState, useEffect, useRef } from "react";
import { Player } from "./components/Player";
import "./App.css";
 
function App() {

    const [songs, setSongs] = useState([])
    const [loading,setLoading] = useState(true)
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState();
    const [skipped,setSkipped] = useState(false)

    const audioElem = useRef(null);


    // // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/api").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setSongs(data)
                setLoading(false)
                setCurrentSong(data[1])
                console.log(data[1])
                console.log(data)
            })
        );
    }, []);

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

    useEffect(()=>{
        console.log(audioElem.current)
        if(audioElem.current){
            audioElem.current.play()
        }
      }, [skipped])

    if(loading) return <h1>Loading...</h1>

    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })

      }
    //   console.log(currentSong)
    //   console.log(audioElem)
    return (
        <div className="App">
            <audio src={`/song/${currentSong.file}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player songs={songs} setSongs={setSongs} isplaying={isplaying} setisplaying={setisplaying} audioElem={audioElem}
             currentSong={currentSong} setCurrentSong={setCurrentSong} skipped={skipped} setSkipped={setSkipped}/>
        </div>
    );
}

export default App;