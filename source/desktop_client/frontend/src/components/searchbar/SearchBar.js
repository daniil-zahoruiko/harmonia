import {useContext } from "react"
import {FaSearch} from "react-icons/fa"
import { SongsContext } from "../../SongsData"
import "../../styles/searchbar.css"



export const SearchBar = ({setResult, input, setInput}) =>{
    const {db:[songs]} = useContext(SongsContext)


    const handleChange = (value) =>{
        setInput(value)
        setResult(songs.filter((song)=>{
            console.log(song.artist,song.title)
            return value && song.title && (song.title.toLowerCase().includes(value.toLowerCase()) ||  song.title.toUpperCase().includes(value.toUpperCase()))
        }))
    }

    return(
        <div className="input_wrapper">
        <input
            id="search_input"
            placeholder="search..."
            value={input}
            onChange={(e)=>handleChange(e.target.value)}
        />
        <FaSearch color="#44489F" id="search_icon"/>
        </div>
    )
}