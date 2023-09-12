import {useContext, useState } from "react"
import {FaSearch} from "react-icons/fa"
import {RxCross1} from "react-icons/rx"
import { SongsContext } from "../../SongsData"
import "../../styles/searchbar.css"



export const SearchBar = ({setResult, input, setInput}) =>{
    const {db:[songs,artists,albums]} = useContext(SongsContext)

    const handleChange = (value) =>{
        setInput(value)
        if(value === "")
        {
            setResult([]);
            return;
        }
        setResult({
            "artists":[...artists.filter((artist)=>{
                    return value && artist.name && (artist.name.toLowerCase().includes(value.toLowerCase()) ||  artist.name.toUpperCase().includes(value.toUpperCase()))})],

            "albums":[...albums.filter((album)=>{
                    return value && album.name && (album.name.toLowerCase().includes(value.toLowerCase()) ||  album.name.toUpperCase().includes(value.toUpperCase()))
                }),
                ...albums.filter((album)=>{
                    return value && (album.artist
                    && (album.artist.toLowerCase().includes(value.toLowerCase()) ||  album.artist.toUpperCase().includes(value.toUpperCase())))
                })],

            "songs":[...songs.filter((song)=>{
                return value && (
                    (song.artist
                    && (song.artist.toLowerCase().includes(value.toLowerCase()) ||  song.artist.toUpperCase().includes(value.toUpperCase())))
                    ||(song.title
                    && (song.title.toLowerCase().includes(value.toLowerCase()) ||  song.title.toUpperCase().includes(value.toUpperCase())))
                )
            })]})
}

    const exit = ()=>{
        setInput("")
        setResult([])
    }

    return(
        <div className="input_wrapper">
        <input
            id="search_input"
            placeholder="search..."
            value={input}
            onChange={(e)=>handleChange(e.target.value)}
        />
        {input
        ?<RxCross1 color="#44489F" id="search_icon" onClick={exit}/>
        :<FaSearch color="#44489F" id="search_icon"/>
        }
        </div>
    )
}


export const PlaylistSearchBar = ({songs,input,setInput,setResult}) =>{



    const handleChange = (value) =>{
        setInput(value)
        if(value === "")
        {
            setResult(songs);
            return;
        }
        setResult([...songs.filter((song)=>{
                    return value && (
                        (song.artist
                        && (song.artist.toLowerCase().includes(value.toLowerCase()) ||  song.artist.toUpperCase().includes(value.toUpperCase())))
                        ||(song.title
                        && (song.title.toLowerCase().includes(value.toLowerCase()) ||  song.title.toUpperCase().includes(value.toUpperCase())))
                    )
                })])
    }

    const exit = ()=>{
        setInput("")
        setResult(songs)
    }

    return(
        <div className="input_wrapper playlist_input">
        <input
            id="search_input"
            placeholder="search..."
            value={input}
            onChange={(e)=>handleChange(e.target.value)}
        />
        {input
        ?<RxCross1 color="#44489F" id="search_icon" onClick={exit}/>
        :<FaSearch color="#44489F" id="search_icon"/>
        }
        </div>
    )
}