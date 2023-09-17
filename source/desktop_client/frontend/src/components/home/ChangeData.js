import { useState, useContext, useRef } from "react"
import { changePlaylistImage, updateData, updatePlaylist } from "../../api";
import { UserContext } from "../../UserContext";
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { changeUserDataSchema,changePlaylistDataSchema } from "../utils/ValidationSchemas";
import {MdCancel} from "react-icons/md"
import { SongsContext } from "../../SongsData";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import {BsFillCloudUploadFill} from "react-icons/bs"
import {IoArrowBackCircleOutline} from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom";
import "../../styles/changedata.css"


export const ChangeUserData = () =>
{
    const { username:[username,setUsername],
            email:[email,setEmail],
            full_name:[fullName,setFullName] } = useContext(UserContext);

    const navigate = useNavigate()


    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [error, setError] = useState(null);

    const {
        access_token: [token, ,]
    } = useContext(UserContext)

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues:{
            username: username,
            email: email,
            fullName:fullName,
            password:"",
            passwordConfirmation:""
        },
        resolver:yupResolver(changeUserDataSchema)
    })

    async function onSubmit(data)
    {
        await updateData({token: token, username: username,email:email,fullName:fullName, input:data})
        .then(() => setError(null))
        .catch((error) => setError(error.message));
        setUsername(data.username)
        setEmail(data.email)
        setFullName(data.fullName)
        navigate("/profile")
    }

    const passwordToggle = () =>{
        setPasswordVisibility(!passwordVisibility)
    }


    return(
        <div className="change_data_wrapper">
            <Link to="/profile" className="back_wrapper back_change_data"><IoArrowBackCircleOutline className="back_wrapper_svg"/></Link>
            <form className="change_data_form" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Change your data!</h1>
                <div className="form_row">
                    <label htmlFor="username">
                        New Username:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.username?"invalid":""}`} id="username"  placeholder="Username" {...register("username")} />
                    </div>
                    <p className="form_error">{errors.username?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.password?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="password"  placeholder="Password" {...register("password")} />
                        {passwordVisibility?<AiOutlineEye onClick={passwordToggle} className="pass_visibility"/>:<AiOutlineEyeInvisible onClick={passwordToggle} className="pass_visibility"/>}
                    </div>
                    <p className="form_error">{errors.password?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="passwordConfirmation">
                        Confirm password:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.passwordConfirmation?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="passwordConfirmation"  placeholder="Confirm password" {...register("passwordConfirmation")}/>
                    </div>
                    <p className="form_error">{errors.passwordConfirmation?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        New Email:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.email?"invalid":""}`} id="email"  placeholder="Password" {...register("email")} />
                    </div>
                    <p className="form_error">{errors.email?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        New Full Name:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.fullName?"invalid":""}`} id="email"  placeholder="Password" {...register("fullName")} />
                    </div>
                    <p className="form_error">{errors.fullName?.message}</p>
                </div>
                {error != null ? <p className="login_error">{error}</p> : null}
                <div className="change_data_button_wrapper">
                    <input
                        type="button"
                        onClick={() => reset(
                            {
                                username: username,
                                email: email,
                                fullName:fullName,
                                password:"",
                                passwordConfirmation:""
                            }
                        )}
                        id="cancel_change"
                        value="Cancel"
                    />
                    <input id="submit_change" type="submit" value="Change data"/>
                </div>
            </form>
        </div>
    );
}


export const ChangePlaylistData = ({setChange}) =>{
    const { access_token: [token],
        user_playlists:[playlists,setPlaylists] } = useContext(UserContext);


    const {playlistRender:[showedPlaylist,setShowedPlaylist],
        cachedPlaylistImages:[playlistImages,setPlaylistImages],
        cachedAlbumImages:[albumImages,] } = useContext(SongsContext)

    const [error, setError] = useState(null);
    const [imageUrl,setImageUrl] = useState(playlistImages[showedPlaylist.id])
    const [image,setImage] = useState()
    const formRef = useRef(null)


    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            name: showedPlaylist.name,
            description: showedPlaylist.description,
            file:""
        },
        resolver:yupResolver(changePlaylistDataSchema)
    })


    const closeMenu = (e) =>{
        if(formRef.current && !formRef.current.contains(e.target)){
            setChange(false)
        }
    }

    document.addEventListener('mousedown',closeMenu)

    async function onSubmit(data)
    {
        await updatePlaylist({token:token,id:showedPlaylist.id,name:showedPlaylist.name,description:showedPlaylist.name,data:data})
        .then(() => {
            setError(null);
            var arr = []
            for(let i=0;i<playlists.length;i++){
                if(playlists[i].id === showedPlaylist.id){
                    arr.push({...playlists[i],name : data.name,description:data.description})
                    setShowedPlaylist({...showedPlaylist,name : data.name,description:data.description})
                }else{
                    arr.push(playlists[i])
            }}
            setPlaylists(arr)
        })
        .catch((error) => setError(error.message));
        setChange(false)
        if(image){
            const newData = new FormData()
            newData.append('file',image)
            await changePlaylistImage({token:token,id:showedPlaylist.id,image:newData})
            let temp_dict = {...playlistImages}
            temp_dict[showedPlaylist.id] = imageUrl
            setPlaylistImages(temp_dict)
        }
    }


    return(
        <div className="change_playlist_outer">
            <div ref={formRef} className="change_pl_data_wrapper">
                <MdCancel onClick={()=>setChange(false)} className="change_exit"/>
                <h1>¡Edit details!</h1>
                <div className="change_playlist_inputs">
                    <div>
                        <label htmlFor="file-upload">
                            <div className="playlist_image_label_wrapper">
                                <img className="playlist_change_image" alt="song" src={imageUrl==="No Content" && showedPlaylist.songs[0]?albumImages[showedPlaylist.songs[0].albumId]:imageUrl} />
                                <BsFillCloudUploadFill className="playlist_image_upload_svg"/>
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
                    <form className="change_pl_data_form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form_row_playlist">
                            <p className="playlist_change_label" htmlFor="username">
                                Name:
                            </p>
                            <div className="form_input_wrapper_playlist">
                                <input className={`signing_input_playlist ${errors.name?"invalid":""}`} id="name" {...register("name")} />
                            </div>
                            <p className="form_error">{errors.name?.message}</p>
                        </div>
                        <div className="form_row_playlist">
                            <p className="playlist_change_label" htmlFor="password">
                                Description:
                            </p>
                            <div className="form_input_wrapper_playlist">
                                <textarea rows="5" className={`signing_input_playlist ${errors.description?"invalid":""}`} id="description" {...register("description")} />
                            </div>
                            <p className="form_error">{errors.password?.message}</p>
                        </div>
                        {error != null ? <p className="login_error">{error}</p> : null}
                        <input id="submit_change" type="submit" value="Save"/>
                    </form>
                </div>
            </div>
        </div>

    );
}