import { useState, useContext, useRef } from "react"
import { LogMeIn, addSong, changePlaylistImage, createArtist, updateData, updatePlaylist } from "../../api";
import { UserContext } from "../../UserContext";
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { changeUserDataSchema,changePlaylistDataSchema } from "./ValidationSchemas";
import {MdCancel,MdOutlineAudioFile} from "react-icons/md"
import "../../styles/changedata.css"
import { SongsContext } from "../../SongsData";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { getValues } from "../helpers";
import {BsFillCloudUploadFill,BsPlusCircle} from "react-icons/bs"
import { DropDown } from "./DropDown";


export const CreateArtist = ({setChange}) =>{
    const { access_token: [token,setToken,removeToken],
        user_playlists:[playlists,setPlaylists],
        user_artist_id:[userArtistId,setUserArtistId] } = useContext(UserContext);


    const {playlistRender:[showedPlaylist,setShowedPlaylist],
        cachedPlaylistImages:[playlistImages,setPlaylistImages] } = useContext(SongsContext)

    const [error, setError] = useState(null);
    const [imageUrl,setImageUrl] = useState(playlistImages[showedPlaylist.id])
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
            console.log("no image selected")
            return
        }
        const newData = new FormData()
        newData.append('image',image)
        newData.append("name",data.name)
        await createArtist({token:token,data:newData,setUserArtistId:setUserArtistId})
        .catch((error) => setError(error.message));
        setChange(false)

    }


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="change_pl_data_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1>¡Become a Creator!</h1>
                <div className="change_playlist_inputs">
                    <div>
                        <label htmlFor="file-upload">
                            <div className="song_image_label_wrapper">
                                <img className="playlist_change_image" src={imageUrl} />
                                <BsFillCloudUploadFill className="playlist_image_upload_svg"/>
                            </div>
                        </label>
                        <input onChange={(e)=>{
                            setImageUrl(URL.createObjectURL(e.target.files[0]));
                            setImage(e.target.files[0])
                            }}
                            type="file"
                            id="file-upload"
                        />
                    </div>
                    <form className="change_pl_data_form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form_row_playlist">
                            <p className="playlist_change_label" htmlFor="username">
                                Name:
                            </p>
                            <div className="form_input_wrapper_playlist">
                                <input className={`signing_input_playlist ${errors.name?"invalid":""}`} id="name" {...register("name")} />
                            </div>
                            {/* <p className="form_error">{errors.name?.message}</p> */}
                        </div>
                        {error != null ? <p className="login_error">{error}</p> : null}
                        <input id="submit_change" type="submit" value="Save"/>
                    </form>
                </div>
            </div>
        </div>

    );
}

export const AddSong = ({setChange}) =>{
    const { access_token: [token,setToken,removeToken],
        user_playlists:[playlists,setPlaylists],
        user_artist_id:[userArtistId,setUserArtistId],} = useContext(UserContext);


    const {playlistRender:[showedPlaylist,setShowedPlaylist],
        cachedPlaylistImages:[playlistImages,setPlaylistImages],
        db:[songs,artists,albums], } = useContext(SongsContext)

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

    // Create/Choose Album variables

    const [albumDD,setAlbumDD] = useState(false)
    const [albumName,setAlbumName] = useState()
    const [albumNameShow,setAlbumNameShow] = useState("Choose Album...")
    const [albumNameSubmit,setAlbumNameSubmit] = useState()
    const [albumNameError,setAlbumNameError] = useState("")

    const user_albums = albums.filter(album=>{
        return album.artistId == userArtistId
    })

    console.log(user_albums)


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
            setAlbumDD(false)
            setChooseAlbums(false)
            setCreateAlbum(false)
        }
    }

    document.addEventListener('mousedown',closePopUp)
    document.addEventListener('mousedown',closeMenu)

    async function onSubmit(data)
    {
        if(!audio){
            console.log("no audio selected")
            setError("No audio selected")
        }
        if(!image){
            console.log("no audio selected")
            setError("No image selected")
        }
        if(albumNameShow === "Choose Album..."){
            console.log("no audio selected")
            setError("No album selected")
        }
        if(!audio || !image || albumNameShow === "Choose Album..."){
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
        console.log(albumNameSubmit,albumId)
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
        if(albumName.length<1){
            setAlbumNameError("Required")
            return
        }
        setAlbumNameError("")
        setCreateAlbum(false)
        setAlbumNameSubmit(albumName)
        setAlbumNameShow(albumName)
        setAlbumDD(false)
    }

    console.log(audio)


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="add_song_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1 className="create_song_header">¡Add your song here!</h1>
                <form ref={albumMenuRef} onSubmit={handleSubmit(onSubmit)} className="add_song_inputs">
                    <div  className="add_song_data">
                        <div>
                            <label htmlFor="file-upload">
                                <div className="album_image_label_wrapper">
                                    <img className="playlist_change_image" src={imageUrl} />
                                    {imageUrl?"":<BsFillCloudUploadFill className="album_image_upload_svg"/>}
                                </div>
                            </label>
                            <input onChange={(e)=>{
                                setImageUrl(URL.createObjectURL(e.target.files[0]));
                                setImage(e.target.files[0])
                                }}
                                type="file"
                                id="file-upload"
                                accept="image/webp,image/png,image/jpg,image/jpeg"
                            />
                        </div>
                        <div className="add_song_data_form">
                            <div className="form_row_song">
                                <label htmlFor="title">
                                    <p className="song_data_label">Title:</p>
                                </label>
                                <div className="form_input_wrapper_song">
                                    <input className={`song_input ${errors.name?"invalid":""}`} placeholder="Title..." id="title" {...register("title")} />
                                </div>
                                {/* <p className="form_error">{errors.name?.message}</p> */}
                            </div>
                            <div className="form_row_song">
                                <label htmlFor="genre">
                                    <p className="song_data_label">Genre:</p>
                                </label>
                                <div className="form_input_wrapper_song">
                                    <input className={`song_input ${errors.name?"invalid":""}`} placeholder="Genre..." id="genre" {...register("genre")} />
                                </div>
                                {/* <p className="form_error">{errors.name?.message}</p> */}
                            </div>
                        </div>
                    </div>
                    <div className="add_song_media">
                        <label htmlFor="audio-upload">
                                <div className="song_audio_label_wrapper">
                                    <MdOutlineAudioFile className="song_audio_upload_svg"/>
                                    <p className="song_audio_upload_name">{audio?audio.name.length>20?audio.name.slice(0,20)+"...":audio.name:"Choose music..."}</p>
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
                                {albumNameShow !=="Choose Album..."?"":<BsPlusCircle className="song_album_upload_svg"/>}
                                <p>{albumNameShow}</p>
                            </div>
                            {albumDD
                            ?<div ref={popUpRef} className="dd-list">
                                <div onClick={handleAlbumCreation} className="dd-list-item">
                                    <p>Create an album</p>
                                </div>
                                <div onClick={handleAlbumMenuPick} className="dd-list-item">
                                    <p>Choose an album</p>
                                </div>
                                <div className="dd-list-item">
                                    <p onClick={(()=>{setAlbumId(0);setAlbumDD(false);setAlbumNameShow("Single")})}>Single</p>
                                </div>
                            </div>
                            :""}

                        </div>
                    </div>
                    <input id="submit_song" type="submit" value="Upload"/>
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
                        <h2 className="create_album_header">¡Create album!</h2>
                        <div className="form_row_song">
                            <label htmlFor="album_name">
                                <p className="song_data_label" htmlFor="username">
                                        Name:
                                </p>
                            </label>
                            <div className="form_input_wrapper_song">
                                <input placeholder="Name..." className={`song_input ${errors.name?"invalid":""}`}
                                id="album_name"
                                value={albumName}
                                onChange={(e)=>{setAlbumName(e.target.value)}}  />
                            </div>
                            <p className="form_error">{albumNameError}</p>
                        </div>
                        <input id="submit_song" type="submit" value="Create album"/>
                    </form>
                    :""}
            </div>
        </div>

    );
}