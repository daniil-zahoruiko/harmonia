import { useContext, useEffect, useState } from "react"
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
    const [searchLoaded, setSearchLoaded] = useState(true);
    const [waitingSearch, setWaitingSearch] = useState(false);

    const changePlaylist = (owner,type,name,description,songs) =>{
        setShowedPlaylist({owner:owner,type:type,name:name,description:description,songs:songs,id:name})
        setCurrentPage("playlist-view")
    }

    useEffect(() => {
        //console.log("Search loaded was changed," + searchLoaded);
        if(searchLoaded && waitingSearch)
        {
            setResult(songs.filter((song)=>{
                return input && song.title && (song.title.toLowerCase().includes(input.toLowerCase()) ||  song.title.toUpperCase().includes(input.toUpperCase()))
            }));
            setWaitingSearch(false);
            console.log("Addressed waiting search");
        }
    }, [searchLoaded])

    return(
        <>
            <SearchBar setResult={setResult} input={input} setInput={setInput} searchLoaded={searchLoaded} setWaitingSearch={setWaitingSearch}/>
            {result.length
            ?<SearchResults results={result} setInput={setInput} setResult={setResult} setSearchLoaded={setSearchLoaded}/>
            :<div className="genres_cards_wrapper">
            {categories.map((category,key)=>{
                const genre_songs = songs.filter((song)=> song.genre === category)
                return <CategoryCard onClick={()=>changePlaylist("HARMONIA","Public",category,`${category} description...`,genre_songs)} key={key} category={category}/>
            })}
            </div>}

        </>
    )

}