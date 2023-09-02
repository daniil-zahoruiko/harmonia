import { useState } from "react"
import { LogIn } from "../login/LogIn";
import { SignUp } from "../login/SignUp";
import "../../styles/loggedout.css"

export const LoggedOut = () =>
{
    const [selectedAction, setSelectedAction] = useState("None");

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
                    <main className="logged_out_background">
                        <div className="logged_out_wrapper">
                            <h1>¡Welcome to HARMONIA!</h1>
                            <div className="logged_buttons">
                                <button className="logged_out_button" onClick={() => setSelectedAction("LogIn")}>Log In</button>
                                <button className="logged_out_button logged_out_singup" onClick={() => setSelectedAction("SignUp")}>Sign Up</button>
                            </div>
                            <p>Designed & Built
                                by <a className="vdnk" target="_blank" rel="noreferrer" href="https://avdieienko.com">VDNK</a> & <a target="_blank" rel="noreferrer" href="https://github.com/daniil-zahoruiko">Daniil Zahoruiko</a></p>
                        </div>
                    </main>
                );
        }
    }

    return getCurrentDisplay();
}