import { useContext, useState } from "react"
import { createPlaylist } from "../../api"
import { UserContext } from "../../UserContext"
import { SongsContext } from "../../SongsData"
import { useNavigate } from "react-router-dom";
import {MdCancel} from "react-icons/md"
import {BiError} from "react-icons/bi"




export const CreatePlaylistPopUp = ({activated}) =>{

    const [name,setName] = useState("")
    const navigate = useNavigate();
    const{page:[currentPage,setCurrentPage],
        playlistRender:[showedPlaylist,setShowedPlaylist],} = useContext(SongsContext)
    const {access_token: [token, ,],
        user_playlists:[playlists,setPlaylists],
    username:[username,]} = useContext(UserContext)

    const submit = async (e) =>{
        e.preventDefault()
        await createPlaylist({token:token,name:name,setPlaylists:setPlaylists,setShowedPlaylist:setShowedPlaylist,username:username})
        navigate("/playlist");
    }

    return(
        <form onSubmit={submit} style={{display:`${activated?"block":"none"}`}}>
            <label htmlFor="Name"></label>
            <input onChange={(e)=>setName(e.target.value)} value={name} id="Name" placeholder="Name" />
            <input id="Name" type="submit" placeholder="Name" />
        </form>
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