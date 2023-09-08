import { useContext } from "react"
import { UserContext } from "../../UserContext"
import { LogMeOut } from "../../api";
import { SongsContext } from "../../SongsData";
import {AiOutlineUser} from "react-icons/ai"
import "../../styles/profile.css"



export default () => {
    const { access_token: [,,removeToken],
        error: [, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        settings:[settings,setSettings] } = useContext(UserContext);


    const { page:[currentPage,setCurrentPage]} = useContext(SongsContext)

    function handleLogOut()
    {
        LogMeOut({removeToken});
    }

    return(
        <div>
            <div className="profile_wrapper">
                <div className="profile_image_wrapper">
                    <AiOutlineUser/>
                </div>
                <div className="profile_data_wrapper">
                    <h1 className="profile_name">{fullName}</h1>
                    <p className="profile_username">#{username}</p>
                    <p className="profile_email">{email}</p>
                    <button className="profile_button" onClick={()=>setCurrentPage("change-data")}>Change data</button>
                </div>
            </div>
            <button className="profile_button profile_log_out" onClick={handleLogOut}>Log Out</button>
        </div>

    );
}