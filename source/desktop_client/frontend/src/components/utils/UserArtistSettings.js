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
    const formRef = useRef(null)

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

    document.addEventListener('mousedown',closeMenu)

    async function onSubmit(data)
    {
        if(!audio){
            console.log("no audio selected")
            return
        }
        console.log("bam")
        const newData = new FormData()
        newData.append('audio',audio)
        newData.append('image',image)
        newData.append('title',data.title)
        newData.append('genre',data.genre)
        newData.append("artist_id",userArtistId)
        newData.append("album_id",0)
        // await changePlaylistImage({token:token,id:showedPlaylist.id,image:newData})
        // let temp_dict = {...playlistImages}
        // temp_dict[showedPlaylist.id] = imageUrl
        // setPlaylistImages(temp_dict)
        await addSong({token:token,data:newData})
        // .then(() => {
        //     setError(null);
        //     var arr = []
        //     for(let i=0;i<playlists.length;i++){
        //         if(playlists[i].id === showedPlaylist.id){
        //             arr.push({...playlists[i],name : data.name,description:data.description})
        //             setShowedPlaylist({...showedPlaylist,name : data.name,description:data.description})
        //         }else{
        //             arr.push(playlists[i])
        //     }}
        //     setPlaylists(arr)
        // })
        .catch((error) => setError(error.message));
        setChange(false)

    }

    console.log(audio)


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="add_song_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1>¡Add your song here!</h1>
                <form className="add_song_inputs">
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
                        </div>
                        <div className="change_pl_data_form" onSubmit={handleSubmit(onSubmit)}>
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
                    <input id="submit_song" type="submit" value="Upload"/>
                </form>
            </div>
        </div>

    );
}