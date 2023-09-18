import { useState, useContext, useRef } from "react"
import { addSong, createArtist } from "../../api";
import { UserContext } from "../../UserContext";
import { SongsContext } from "../../SongsData";
import {useForm} from "react-hook-form"
import {MdCancel,MdOutlineAudioFile} from "react-icons/md"
import {BsFillCloudUploadFill,BsPlusCircle} from "react-icons/bs"
import { LoadedImage } from "./LoadedImage";
import "../../styles/changedata.css"
import "../../styles/dropdown.css"
import { useTranslation } from "react-i18next";



export const CreateArtist = ({setChange}) =>{
    const { access_token: [token],
        user_artist_id:[,setUserArtistId] } = useContext(UserContext);

    const [error, setError] = useState(null);
    const [imageUrl,setImageUrl] = useState()
    const [image,setImage] = useState()
    const formRef = useRef(null)


    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            name: "",
            file:""
        }
    })


    const closeMenu = (e) =>{
        if(formRef.current && !formRef.current.contains(e.target)){
            setChange(false)
        }
    }

    document.addEventListener('mousedown',closeMenu)

    async function onSubmit(data)
    {
        if(!image){
            setError("No image selected")
            return
        }
        if(data.name === ""){
            setError("Name required")
            return
        }
        const newData = new FormData()
        newData.append('image',image)
        newData.append("name",data.name)
        await createArtist({token:token,data:newData,setUserArtistId:setUserArtistId})
        .catch((error) => setError(error.message));
        setChange(false)

    }

    console.log(imageUrl)

    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="change_pl_data_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1>¡Become a Creator!</h1>
                <div className="change_playlist_inputs">
                    <div>
                        <label htmlFor="file-upload">
                            <div className={imageUrl?"playlist_image_label_wrapper":"album_image_label_wrapper"}>
                                <LoadedImage className="playlist_change_image" alt="artist" src={imageUrl?imageUrl:"none"} />
                                {/* {imageUrl?"":<BsFillCloudUploadFill className="album_image_upload_svg"/>} */}
                                <BsFillCloudUploadFill className={imageUrl?"playlist_image_upload_svg":"album_image_upload_svg"}/>
                            </div>
                        </label>
                        <input onChange={(e)=>{
                            setImageUrl((prev)=>{return(e.target.files[0]?URL.createObjectURL(e.target.files[0]):prev)});
                            setImage((prev)=>{return(e.target.files[0]?e.target.files[0]:prev)})
                            }}
                            type="file"
                            id="file-upload"
                            accept="image/webp,image/png,image/jpg,image/jpeg"
                        />
                    </div>
                    <form className="become_artist_form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form_row_artist">
                            <p className="become_artist_label" htmlFor="username">
                                Name:
                            </p>
                            <div className="form_input_wrapper_artist">
                                <input className={`signing_input_artist ${errors.name?"invalid":""}`} placeholder="Name..." id="name" {...register("name")} />
                            </div>
                        </div>
                        {error != null ? <p className="login_error">{error}</p> : null}
                        <input id="submit_change" type="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        </div>

    );
}

export const AddSong = ({setChange}) =>{
    const { access_token: [token],
        user_artist_id:[userArtistId],} = useContext(UserContext);


    const {db:[songs,,albums], } = useContext(SongsContext)

    const [error, setError] = useState(null);
    const [audio,setAudio] = useState()
    const [imageUrl,setImageUrl] = useState()
    const [image,setImage] = useState()
    const [albumId,setAlbumId] = useState(0)
    const [chooseAlbums,setChooseAlbums] = useState(false)
    const [createAlbum,setCreateAlbum] = useState(false)
    const [top,setTop] = useState(0)
    const [left,setLeft] = useState(0)
    const formRef = useRef(null)
    const albumMenuRef = useRef(null)
    const popUpRef = useRef(null)
    const ddRef = useRef(null)
    const [t,i18n] = useTranslation("settings")


    // Create/Choose Album variables

    const [albumDD,setAlbumDD] = useState(false)
    const [albumName,setAlbumName] = useState()
    const [albumNameShow,setAlbumNameShow] = useState(`${t("add_song.choose_album")}...`)
    const [albumNameSubmit,setAlbumNameSubmit] = useState()
    const [albumNameError,setAlbumNameError] = useState("")

    const user_albums = albums.filter(album=>{
        return album.artistId == userArtistId
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            title: "",
            genre:""
        }
    })


    const closeMenu = (e) =>{
        if(formRef.current && !formRef.current.contains(e.target)){
            setChange(false)
        }
    }
    const closePopUp = (e) =>{
        if(popUpRef.current && !popUpRef.current.contains(e.target)){
            setChooseAlbums(false)
            setCreateAlbum(false)
        }
    }

    const closeDropDown = (e) =>{
        if(ddRef.current && !ddRef.current.contains(e.target)  && (popUpRef.current && !popUpRef.current.contains(e.target))){
            setAlbumDD(false)
            setChooseAlbums(false)
            setCreateAlbum(false)
        }
    }

    document.addEventListener('mousedown',closePopUp)
    document.addEventListener('mousedown',closeMenu)
    document.addEventListener('mousedown',closeDropDown)


    async function onSubmit(data)
    {
        if(!audio){
            setError(t("errors.no_audio"))
            return
        }
        if(!image){
            setError(t("errors.no_image"))
            return
        }
        if(albumNameShow === "Choose Album..."){
            setError(t("errors.no_album"))
            return
        }
        if(data.title === ""){
            setError(t("errors.no_title"))
            return
        }
        const newData = new FormData()
        newData.append('audio',audio)
        newData.append('image',image)
        newData.append('title',data.title)
        newData.append('genre',data.genre)
        newData.append("artist_id",userArtistId)
        newData.append("album_id",albumId)
        newData.append("album_name",albumNameSubmit)
        await addSong({token:token,data:newData,albums:albums,songs:songs})
        .catch((error) => setError(error.message));
        setChange(false)
        window.location.reload(false)
    }

    const handleAlbumMenuPick = () =>{
        setChooseAlbums(!chooseAlbums)
        setCreateAlbum(false)
        setTop(albumMenuRef.current.offsetTop)
        setLeft(albumMenuRef.current.offsetLeft+albumMenuRef.current.offsetWidth)
    }

    const handleAlbumCreation = () =>{
        setCreateAlbum(!createAlbum)
        setChooseAlbums(false)
        setTop(albumMenuRef.current.offsetTop)
        setLeft(albumMenuRef.current.offsetLeft+albumMenuRef.current.offsetWidth)
    }

    const AlbumCreationSubmit = (e) =>{
        e.preventDefault()
        if(!albumName || albumName.length<1){
            setAlbumNameError(t("errors.required"))
            return
        }
        setAlbumNameError("")
        setCreateAlbum(false)
        setAlbumNameSubmit(albumName)
        setAlbumNameShow(albumName)
        setAlbumDD(false)
    }


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="add_song_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1 className="create_song_header">{t("add_song.header")}</h1>
                <form ref={albumMenuRef} onSubmit={handleSubmit(onSubmit)} className="add_song_inputs">
                    <div  className="add_song_data">
                        <div>
                            <label htmlFor="file-upload">
                                <div className={imageUrl?"playlist_image_label_wrapper":"album_image_label_wrapper"}>
                                    <LoadedImage className="playlist_change_image" alt="song" src={imageUrl?imageUrl:"none"} />
                                    <BsFillCloudUploadFill className={imageUrl?"playlist_image_upload_svg":"album_image_upload_svg"}/>
                                </div>
                            </label>
                            <input onChange={(e)=>{
                                setImageUrl((prev)=>{return(e.target.files[0]?URL.createObjectURL(e.target.files[0]):prev)});
                                setImage((prev)=>{return(e.target.files[0]?e.target.files[0]:prev)})
                                }}
                                type="file"
                                id="file-upload"
                                accept="image/webp,image/png,image/jpg,image/jpeg"
                            />
                        </div>
                        <div className="add_song_data_form">
                            <div className="form_row_song">
                                <label htmlFor="title">
                                    <p className="song_data_label">{t("add_song.title")}:</p>
                                </label>
                                <div className="form_input_wrapper_song">
                                    <input className={`song_input ${errors.name?"invalid":""}`} placeholder={`${t("add_song.title")}...`} id="title" {...register("title")} />
                                </div>
                            </div>
                            <div className="form_row_song">
                                <label htmlFor="genre">
                                    <p className="song_data_label">{t("add_song.genre")}:</p>
                                </label>
                                <div className="form_input_wrapper_song">
                                    <input className={`song_input ${errors.name?"invalid":""}`} placeholder={`${t("add_song.genre")}...`} id="genre" {...register("genre")} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="add_song_media">
                        <label htmlFor="audio-upload">
                                <div className="song_audio_label_wrapper">
                                    <MdOutlineAudioFile className="song_audio_upload_svg"/>
                                    <p className="song_audio_upload_name">
                                        {audio
                                        ?audio.name.length>20
                                        ?audio.name.slice(0,20)+"..."
                                        :audio.name
                                        :t("add_song.choose_music")}
                                    </p>
                                </div>
                            </label>
                        <input onChange={(e)=>{
                            setAudio(e.target.files[0])
                            }}
                            type="file"
                            id="audio-upload"
                            accept="audio/mpeg"
                        />
                        <div className="dd-wrapper">
                            <div onClick={()=>setAlbumDD(!albumDD)} className="dd-header-title">
                                {albumNameShow !==`${t("add_song.choose_album")}...`?"":<BsPlusCircle className="song_album_upload_svg"/>}
                                <p>{albumNameShow}</p>
                            </div>
                            {albumDD
                            ?<div ref={ddRef} className="dd-list">
                                <div onClick={handleAlbumCreation} className="dd-list-item">
                                    <p>{t("add_song.create_album")}</p>
                                </div>
                                <div onClick={handleAlbumMenuPick} className="dd-list-item">
                                    <p>{t("add_song.choose_album")}</p>
                                </div>
                                <div className="dd-list-item">
                                    <p onClick={(()=>{setAlbumId(0);setAlbumDD(false);setAlbumNameShow(t("add_song.single"))})}>
                                        {t("add_song.single")}
                                    </p>
                                </div>
                            </div>
                            :""}

                        </div>
                    </div>
                    <input id="submit_song" type="submit" value={t("add_song.upload")}/>
                    {error != null ? <p className="login_error">{error}</p> : null}
                </form>
                {/* ----------- Album choice popups---------------- */}
                {chooseAlbums
                    ?<div ref={popUpRef} style={{
                        position:"absolute",
                        left:`${left}px`,
                        top:`${top}px`,
                    }} className="album_choice">
                        {user_albums.map((album)=>{
                            return (
                            <>
                                <p className="album_one_choice" onClick={()=>{setAlbumId(album.id);setAlbumNameShow(album.name);setAlbumDD(false);setChooseAlbums(false)}}>{album.name}</p>
                                <hr/>
                            </>
                            )
                        })}
                    </div>
                    :createAlbum
                    ?<form ref={popUpRef} style={{
                        position:"absolute",
                        left:`${left}px`,
                        top:`${top}px`,
                    }} className="album_choice"
                        onSubmit={(e)=>AlbumCreationSubmit(e)}>
                        <h2 className="create_album_header">
                            {t("add_song.create_album")}
                        </h2>
                        <div className="form_row_song">
                            <label htmlFor="album_name">
                                <p className="song_data_label" htmlFor="username">
                                        {t("add_song.album_name")}:
                                </p>
                            </label>
                            <div className="form_input_wrapper_song">
                                <input placeholder={`${t("add_song.album_name")}...`} className={`song_input ${errors.name?"invalid":""}`}
                                id="album_name"
                                value={albumName}
                                onChange={(e)=>{setAlbumName(e.target.value)}}  />
                            </div>
                            <p className="form_error">{albumNameError}</p>
                        </div>
                        <input id="submit_song" type="submit" value={t("add_song.upload")}/>
                    </form>
                    :""}
            </div>
        </div>

    );
}