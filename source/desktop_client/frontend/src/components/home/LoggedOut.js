import { useState } from "react"
import { LogIn } from "../login/LogIn";
import { SignUp } from "../login/SignUp";

export const LoggedOut = ({token, setToken}) =>
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
                    <div>
                        <button onClick={() => setSelectedAction("LogIn")}>Log In</button>
                        <button onClick={() => setSelectedAction("SignUp")}>Sign Up</button>
                    </div>
                );
        }
    }

    return getCurrentDisplay();
}