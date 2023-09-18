import { useTranslation } from "react-i18next";
import { FavArtists, LibraryPlaylists } from "../utils/Sections";



export const Library = () =>{

    const [t,] = useTranslation("library")

    return(
        <div>
            <h1 className="top_picks_header">{t("playlists")}</h1>
            <LibraryPlaylists/>
            <h1 className="top_picks_header">{t("followed_artists")}</h1>
            <FavArtists/>
        </div>
    )
}