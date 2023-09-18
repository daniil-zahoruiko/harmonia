import { useContext } from "react"
import { SongsContext } from "../../SongsData";
import { TopPicks } from "../utils/Sections";
import "../../styles/home.css"
import { useTranslation } from "react-i18next";


export const Home = () => {

    const { db:[songs] } = useContext(SongsContext)

    const [t,] = useTranslation("global")

    return(
        <div className="top_picks_wrapper">
            <h1 className="top_picks_header">{t("top_picks")}</h1>
            <div className="top_picks_songs">
                <TopPicks songs={songs.slice(0,15)}/>
            </div>
        </div>
    )
}