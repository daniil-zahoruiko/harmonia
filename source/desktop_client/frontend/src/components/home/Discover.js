import { useContext, useState } from "react"
import { SongsContext } from "../../SongsData";
import { CategoryCard } from "../utils/CategoryCard"
import "../../styles/discover.css"
import { MainWindow } from "../MainWindow"
import { Home } from "./Home"
import { SearchBar } from "../searchbar/SearchBar";
import { SearchResults } from "../searchbar/SearchResults";

const categories = ["hip-hop","rock","rap","trap","classical","workout","jazz","indie","country"]

export const Discover = () =>{
    const { db:[songs,loading],
            playlistRender:[showedPlaylist,setShowedPlaylist],
            page:[currentPage,setCurrentPage]   } = useContext(SongsContext)

    const [result,setResult] = useState([])
    const [input,setInput] = useState("")

    const changePlaylist = (owner,type,name,description,songs) =>{
        setShowedPlaylist({owner:owner,type:type,name:name,description:description,songs:songs,id:name})
        setCurrentPage("playlist-view")
    }

    return(
        <>
            <SearchBar setResult={setResult} input={input} setInput={setInput}/>
            {result.length
            ?<SearchResults results={result} setInput={setInput} setResult={setResult}/>
            :<div className="genres_cards_wrapper">
            {categories.map((category,key)=>{
                const genre_songs = songs.filter((song)=> song.genre === category)
                return <CategoryCard onClick={()=>changePlaylist("Project name","Public",category,`${category} description...`,genre_songs)} key={key} category={category}/>
            })}
            </div>}

        </>
    )

}