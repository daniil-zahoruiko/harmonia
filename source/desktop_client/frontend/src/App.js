import React, { useState, useEffect } from "react";
import { Audio } from "./components/songPlayer/Audio";
import { Loader } from "./components/Loader";
import "./App.css";
 
function App() {

    const [songs, setSongs] = useState([])
    const [loading,setLoading] = useState(true)

    // // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/api").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setSongs(data)
                setLoading(false)
                console.log(data[1])
                console.log(data)
            })
        );
    }, []);


    // Load loader page until data is loaded
    if(loading) return <Loader/>



    return (
        <div className="App">
             <Audio songs={songs} setSongs={setSongs}/>
        </div>
    );
}

export default App;