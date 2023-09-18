import { useContext } from "react"
import { UserContext } from "../../UserContext"
import { LogMeOut } from "../../api";
import {AiOutlineUser} from "react-icons/ai"
import { Link } from "react-router-dom";
import "../../styles/profile.css"
import { useTranslation } from "react-i18next";



export const Profile = () => {
    const { access_token: [,,,removeToken],
        username:[username],
        email:[email],
        full_name:[fullName]} = useContext(UserContext);

    const [t,] = useTranslation("profile")


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
                    <Link to="/change" className="profile_button">{t("change_data")}</Link>
                </div>
            </div>
            <button className="profile_button profile_log_out" onClick={handleLogOut}>{t("log_out")}</button>
        </div>

    );
}