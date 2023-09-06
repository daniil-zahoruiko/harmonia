import {useContext } from "react"
import {FaSearch} from "react-icons/fa"
import {RxCross1} from "react-icons/rx"
import { SongsContext } from "../../SongsData"
import "../../styles/searchbar.css"



export const SearchBar = ({setResult, input, setInput}) =>{
    const {db:[songs]} = useContext(SongsContext)

    const handleChange = (value) =>{
        setInput(value)
        setResult(songs.filter((song)=>{
            return value && song.title && (song.title.toLowerCase().includes(value.toLowerCase()) ||  song.title.toUpperCase().includes(value.toUpperCase()))
        }))
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