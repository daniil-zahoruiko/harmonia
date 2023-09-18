import { useContext, useState } from "react"
import { createPlaylist } from "../../api"
import { UserContext } from "../../UserContext"
import { SongsContext } from "../../SongsData"
import { useNavigate } from "react-router-dom";
import {MdCancel} from "react-icons/md"
import {BiError} from "react-icons/bi"
import "../../styles/popups.css"
import { useTranslation } from "react-i18next";




export const CreatePlaylistPopUp = ({setActivate}) =>{

    const [name,setName] = useState("")
    const navigate = useNavigate();
    const{playlistRender:[,setShowedPlaylist],} = useContext(SongsContext)
    const {access_token: [token, ,],
        user_playlists:[,setPlaylists],
    username:[username,]} = useContext(UserContext)

    const [t,] = useTranslation("pop_up")

    const [error,setError] = useState("")

    const submit = async (e) =>{
        e.preventDefault()
        if(!name){
            setError("Name cannot be empty")
            return
        }
        await createPlaylist({token:token,name:name,setPlaylists:setPlaylists,setShowedPlaylist:setShowedPlaylist,username:username})
        setActivate(false)
        navigate("/playlist");
    }

    const validator = (e) =>{
        setName(e.target.value)
        if(e.target.value){
            setError("")
        }
    }

    return(
        <div className="create_playlist_popup">
            <div className="create_playlist_inner">
                <MdCancel onClick={()=>setActivate(false)} className="create_playlist_exit"/>
                <form onSubmit={submit}>
                    <h1>{t("new_playlist.title")}</h1>
                    <label htmlFor="Name">
                        {t("new_playlist.name")}
                    </label>
                    <div className="playlist_form_row">
                        <input
                            className={`${error?"invalid":""}`}
                            onChange={(e)=>validator(e)}
                            value={name} id="Name"
                            placeholder={`${t("new_playlist.name")}...`}
                        />
                        <p className="form_error">{error}</p>
                    </div>
                    <input
                        className="create_submit_button"
                        id="submit"
                        type="submit"
                        value={`${t("new_playlist.submit")}`}
                    />
                </form>
            </div>
        </div>
    )
}

export const ContextPopUp = ({message,exit}) =>{
    return(
        <div className="context_popup">
            <div className="context_popup_inner">
                <div className="context_popup_inner_wrapper">
                    <MdCancel onClick={exit} className="context_exit"/>
                    <div className="context_popup_message_wrapper">
                        <h1 className="context_popup_message">{message}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ErrorPopUp = ({onClick,message}) =>{
    return(
        <div className="error_popup">
            <div className="error_popup_inner">
                <div className="error_popup_inner_wrapper">
                    <MdCancel onClick={onClick} className="error_exit"/>
                    <div className="error_popup_message_wrapper">
                        <BiError className="error_popup_svg"/>
                        <h1 className="error_popup_message">{message}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}