import { useContext } from "react"
import { SongsContext } from "../../SongsData";
import { CategoryCard } from "../utils/CategoryCard"
import "../../styles/discover.css"
import { MainWindow } from "../MainWindow"
import { Home } from "./Home"

const categories = ["hip-hop","rock","rap","trap","classical","workout","jazz","indie","country"]

export const Discover = () =>{
    const {playlistRender:[showedPlaylist,setShowedPlaylist]} = useContext(SongsContext)
    const {page:[currentPage,setCurrentPage]} = useContext(SongsContext)
    const {db:[songs,loading]} = useContext(SongsContext)

    const changePlaylist = (owner,type,name,description,songs) =>{
        setShowedPlaylist({owner:owner,type:type,name:name,description:description,songs:songs,id:name})
        setCurrentPage("playlist-view")
    }

    return(
        <div className="genres_cards_wrapper">
            {categories.map((category,key)=>{
                const genre_songs = songs.filter((song)=> song.genre === category)
                return <CategoryCard onClick={()=>changePlaylist("Project name","Public",category,`${category} description...`,genre_songs)} key={key} category={category}/>
            })}
        </div>
    )

}