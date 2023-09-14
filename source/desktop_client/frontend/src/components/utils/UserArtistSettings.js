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
import {BsFillCloudUploadFill} from "react-icons/bs"
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


    // const closeMenu = (e) =>{
    //     if(formRef.current && !formRef.current.contains(e.target)){
    //         setChange(false)
    //     }
    // }

    // document.addEventListener('mousedown',closeMenu)

    async function onSubmit(data)
    {
        if(!audio){
            console.log("no audio selected")
            return
        }
        const newData = new FormData()
        newData.append('audio',audio)
        newData.append('image',image)
        newData.append('title',data.title)
        newData.append('genre',data.genre)
        newData.append("artist_id",userArtistId)
        newData.append("album_id",albumId)
        await addSong({token:token,data:newData})
        .catch((error) => setError(error.message));
        setChange(false)

    }

    const handleAlbumMenuPick = () =>{
        setChooseAlbums(!chooseAlbums)
        let element = albumMenuRef.current
        let offsetTop = 0
        let offsetLeft = 0
        let count = 0
        while(element){
            offsetTop += element.offsetTop
            offsetLeft += element.offsetLeft
            element = element.offsetParent
            count+=1
            console.log(element)
        }
        setTop(offsetTop-formRef.current.offsetHeight)
        setLeft(offsetLeft)
    }

    const handleAlbumCreation = () =>{
        setCreateAlbum(!createAlbum)
        let element = albumMenuRef.current
        let offsetTop = 0
        let offsetLeft = 0
        let count = 0
        while(element){
            offsetTop += element.offsetTop
            offsetLeft += element.offsetLeft
            element = element.offsetParent
            count+=1
            console.log(element)
        }
        setTop(offsetTop-formRef.current.offsetHeight)
        setLeft(offsetLeft)
    }

    console.log(audio)


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="add_song_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1>¡Add your song here!</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="add_song_inputs">
                    <div className="add_song_data">
                        <div>
                            <label htmlFor="file-upload">
                                <div className="playlist_image_label_wrapper">
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
                        <div className="change_pl_data_form">
                            <div className="form_row_song">
                                <p className="song_data_label" htmlFor="username">
                                    Title:
                                </p>
                                <div className="form_input_wrapper_song">
                                    <input className={`signing_input_song ${errors.name?"invalid":""}`} id="title" {...register("title")} />
                                </div>
                                {/* <p className="form_error">{errors.name?.message}</p> */}
                            </div>
                            <div className="form_row_song">
                                <p className="song_data_label" htmlFor="username">
                                    Genre:
                                </p>
                                <div className="form_input_wrapper_song">
                                    <input className={`signing_input_song ${errors.name?"invalid":""}`} id="genre" {...register("genre")} />
                                </div>
                                {/* <p className="form_error">{errors.name?.message}</p> */}
                            </div>
                            {error != null ? <p className="login_error">{error}</p> : null}
                        </div>
                    </div>
                    <div className="add_song_media">
                        <label htmlFor="audio-upload">
                                <div className="song_audio_label_wrapper">
                                    <MdOutlineAudioFile className="song_audio_upload_svg"/>
                                    <p className="song_audio_upload_name">{audio?audio.name:"Choose music..."}</p>
                                </div>
                            </label>
                        <input onChange={(e)=>{
                            setAudio(e.target.files[0])
                            }}
                            type="file"
                            id="audio-upload"
                        />
                        <div className="dd-wrapper">
                            <div ref={albumMenuRef} className="dd-header-title">
                                <p>Choose Album...</p>
                            </div>
                            <div className="dd-list">
                                <div onClick={handleAlbumCreation} className="dd-list-item">
                                    <p>Create an album</p>
                                </div>
                                <div onClick={handleAlbumMenuPick} className="dd-list-item">
                                    <p>Choose an album</p>
                                </div>
                                <div className="dd-list-item">
                                    <p onClick={(()=>{setAlbumId(0)})}>Single</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input id="submit_song" type="submit" value="Upload"/>
                </form>
            </div>
            {chooseAlbums
            ?<div style={{
                position:"absolute",
                left:`${left}px`,
                top:`${top}px`,
            }} className="album_choice">
                {user_albums.map((album)=>{
                    return <p onClick={()=>setAlbumId(album.id)}>{album.name}</p>
                })}
            </div>
            :createAlbum
            ?<form style={{
                position:"absolute",
                left:`${left}px`,
                top:`${top}px`,
            }} className="album_choice">
                <input/>
            </form>
            :""}

        </div>

    );
}