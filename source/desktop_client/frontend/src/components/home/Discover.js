import { useContext, useState } from "react"
import { SongsContext } from "../../SongsData";
import { CategoryCard } from "../utils/CategoryCard"
import { SearchBar } from "../searchbar/SearchBar";
import { SearchResults } from "../searchbar/SearchResults";
import "../../styles/discover.css"

const categories = ["hip-hop","rock","rap","trap","classical","workout","jazz","indie","country"]

export const Discover = () =>{
    const { db:[songs,],
            playlistRender:[,setShowedPlaylist],
            page:[,setCurrentPage]   } = useContext(SongsContext)

    const [result,setResult] = useState([])
    const [input,setInput] = useState("")

    const changePlaylist = (owner,type,name,description,songs) =>{
        setShowedPlaylist({owner:owner,type:type,name:name,description:description,songs:songs,id:name})
        setCurrentPage("playlist-view")
    }

    console.log(result)
    return(
        <>
            <SearchBar setResult={setResult} input={input} setInput={setInput}/>
            {result.songs
            ?<SearchResults results={result} setInput={setInput} setResult={setResult}/>
            :<div className="genres_cards_wrapper">
            {categories.map((category,key)=>{
                const genre_songs = songs.filter((song)=> song.genre === category)
                return <CategoryCard onClick={()=>changePlaylist("HARMONIA","Public",category,`${category} description...`,genre_songs)} key={key} category={category}/>
            })}
            </div>}

        </>
    )

}