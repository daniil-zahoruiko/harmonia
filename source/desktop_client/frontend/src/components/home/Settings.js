import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../UserContext"
import { AddSong, CreateArtist } from "../utils/UserArtistSettings"
import { SongsContext } from "../../SongsData"
import { SongRow } from "../utils/SongRow"
import { LoadedImage } from "../utils/LoadedImage"
import { FetchImages, updateSettings } from "../../api"
import { ContextMenu } from "../utils/ContextMenu"
import "../../styles/settings.css"
import { useTranslation } from "react-i18next"



export const Settings = () =>{

    const {access_token: [token, ,refreshToken, removeToken],
        error: [, setUserError],
        username:[username],
        settings:[settings,setSettings],
        user_artist_id:[userArtistId]} = useContext(UserContext)

        const {   playing:[isPlaying,setIsPlaying],
            playlist:[currentPlaylist,setCurrentPlaylist],
            songData:[currentSongData,setCurrentSongData],
            song:[songLoaded, setSongLoaded],
            toggles:[PlayPause],
            displayLoad:[,setAllLoaded],
            cachedAlbumImages:[albumImages,setAlbumImages],
            db:[songs,,albums], } = useContext(SongsContext)


    const [becomeArtist,setBecomeArtist] = useState(false)
    const [addSong,setAddSong] = useState(false)

    const userAlbums = albums.filter((album)=>album.artistId == userArtistId)
    const userSongs = songs.filter((song)=>song.artistId == userArtistId)

    const firstRender = useRef(true)


    const fetch = async (data, url,images,setImages,last) =>{
        await FetchImages({data:data, url:url,refreshToken:refreshToken, token,removeToken,setUserError,setAllLoaded,images:images,setImages:setImages})
        if (last) setAllLoaded(true);
    }
    useEffect(()=>{
        if(firstRender.current){
            firstRender.current = false
        }
        else{
            setAllLoaded(false)
            fetch(userAlbums, '/api/album/cover',albumImages,setAlbumImages,true)
        }
    },[])

    const [activated,setActivated] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const [contextId,setContextId] = useState(0)
    const [t,i18n] = useTranslation("settings")


    //language state

    const [language,setLanguage] = useState(settings.language)

    const handleClick = (e,value) => {
        setTop(e.pageY)
        setLeft(e.pageX)
        setActivated(true)
        setContextId(value)
    }

    const data = {owner:username,
        type:"album",
        name:username,
        description:"",
        songs:userSongs,
        id:"user",
        image:""}

    // song onclick functionality
    const songToggle = (index) =>{
        if(!songLoaded) return
        if(currentPlaylist.id !== "user"){
            setCurrentPlaylist(data)
        }
        if(currentSongData === data.songs[index] && currentPlaylist.id === data.id){
            PlayPause()
        }
        else{
            setSongLoaded(false)
            setCurrentSongData(data.songs[index])
            if(!isPlaying) setIsPlaying(true)
        }
    }

    const settingsSubmit = async (e) => {
        e.preventDefault()
        if(language === settings.language){
            return
        }
        i18n.changeLanguage(language)
        await updateSettings({token:token,settings:{...settings,language:language}})
        setSettings(prev=>{return {...prev,language:language}})
    }



    return(
        <div>
            <h1 className="settings_header">{t("main.header")}</h1>
            <form className="settings_form" onSubmit={settingsSubmit}>
                <div>
                    <label htmlFor="language">{t("main.language_header")}</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e)=>setLanguage(e.target.value)}
                    >
                        <option value="en">{t("main.language_list.en")}</option>
                        <option value="ua">{t("main.language_list.ua")}</option>
                    </select>
                </div>
                <input id="settings_submit" type="submit" value={t("main.submit")}/>
            </form>
            {!userArtistId
            ?<h1 className="user_artist_trigger" onClick={()=>setBecomeArtist(true)}>
                {t("main.become_creator")}
            </h1>
            :<>
            <h1 className="user_artist_trigger" onClick={()=>setAddSong(true)}>
                {t("main.add_song")}
            </h1>
            <h2 className="user_songs_header">
                {t("main.your_songs")}:
            </h2>
            {userAlbums.map((album,key)=>{
                return <div className="user_songs_wrapper" key={key}>
                        <div className="user_album">
                            <LoadedImage className={"user_album_image"} src={albumImages[album.id]} />
                            <h1 className="user_album_name">{album.name}</h1>
                        </div>
                        <div className="user_songs">
                            <table className='songs_list'>
                                <colgroup>
                                    <col className='n_col'/>
                                    <col className='title_col'/>
                                    <col className='album_col'/>
                                    <col/>
                                    <col className='time_col'/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <p>#</p>
                                        </th>
                                        <th>
                                            <p>{t("main.title")}</p>
                                        </th>
                                        <th/>
                                        <th>
                                            <p>{t("main.streams")}</p>
                                        </th>
                                        <th/>
                                        <th>
                                            <p>{t("main.length")}</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userSongs.map((song,key)=>{
                                        return(
                                            song.albumId == album.id?
                                            <SongRow type={"album"}
                                                onContextMenu={(e) =>handleClick(e,key)}
                                                key={key}
                                                songs={userSongs}
                                                song={song}
                                                id={key}
                                                imageUrl={albumImages[song.albumId]}
                                                playlistId={"user"}
                                                songToggle = {songToggle}
                                            />:""
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <ContextMenu song={userSongs[contextId]} activated={activated} setActivated={setActivated} top={top} left={left} type={"album"}/>
                    </div>
            })}</>}
            {becomeArtist
            ?<CreateArtist setChange={setBecomeArtist}/>
            :""}
            {addSong
            ?<>
                <AddSong setChange={(setAddSong)}/>
            </>
            :""}
        </div>
    )
}