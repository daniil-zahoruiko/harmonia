import { useContext, useState } from "react"
import { LogIn } from "../login/LogIn";
import { SignUp } from "../login/SignUp";
import "../../styles/loggedout.css"
import { UserContext } from "../../UserContext";
import {MdCancel} from "react-icons/md"
import {BiError} from "react-icons/bi"

export const LoggedOut = () =>
{
    const [selectedAction, setSelectedAction] = useState("None");
    const {error:[userError, setUserError]} = useContext(UserContext);

    const getCurrentDisplay = () =>
    {
        switch(selectedAction)
        {
            case "LogIn":
                return (
                    <LogIn selectedAction={selectedAction} setSelectedAction={setSelectedAction}/>
                );
            case "SignUp":
                return (
                    <SignUp selectedAction={selectedAction} setSelectedAction={setSelectedAction}/>
                );
            default:
                return (
                    <>
                        <main className="logged_out_background">
                            <div className="logged_out_wrapper">
                                <h1>¡Welcome to <span className="project_name main_name">Harmonia</span>!</h1>
                                <div className="logged_buttons">
                                    <button className="logged_out_button" onClick={() => setSelectedAction("LogIn")}>Log In</button>
                                    <button className="logged_out_button logged_out_singup" onClick={() => setSelectedAction("SignUp")}>Sign Up</button>
                                </div>
                                <p>Designed & Built
                                    by <a className="vdnk" target="_blank" rel="noreferrer" href="https://avdieienko.com">VDNK</a> & <a target="_blank" rel="noreferrer" href="https://github.com/daniil-zahoruiko">Daniil Zahoruiko</a></p>
                            </div>
                        </main>
                        {userError
                        ?<div className="error_popup">
                        <div className="error_popup_inner">
                            <div className="error_popup_inner_wrapper">
                                <MdCancel onClick={()=>setUserError(0)} className="error_exit"/>
                                <div className="error_popup_message_wrapper">
                                    <BiError className="error_popup_svg"/>
                                    <h1 className="error_popup_message">{userError}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    :""}

                    </>

                );
        }
    }

    return (
    <>
        {/* {userError} */}
        {getCurrentDisplay()}
    </>
    );
}