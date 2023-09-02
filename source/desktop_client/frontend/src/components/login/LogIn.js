import { useState, useContext } from "react"
import { LogMeIn } from "../../api";
import { UserContext } from "../../UserContext";

export const LogIn = ({selectedAction, setSelectedAction}) =>
{
    const {
        access_token: [token, setToken,]
    } = useContext(UserContext)

    const [logInForm, setLogInForm] = useState({
        "username": "",
        "password": ""
    });

    function handleSubmit()
    {
        if(LogMeIn({token: token, setToken: setToken, username: logInForm.username, password:logInForm.password}))
        {
            console.log('login succcessfull');
        }
        else
        {
            console.log('error');
        }

        setSelectedAction("Main");
    }

    function handleChange(event)
    {
        const {value, name} = event.target
        setLogInForm((prev) => ({
            ...prev, [name]: value
        }));
    }

    return(
        <div>
            <button onClick={() => setSelectedAction("Main")}>Back</button>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <div>
                        <input name="username" placeholder="Username" value={logInForm.username} onChange={handleChange}/>
                    </div>
                </label>
                <br/>
                <label>
                    Password:
                    <div>
                        <input name = "password" placeholder="Password" value={logInForm.password} onChange={handleChange}/>
                    </div>
                </label>
                <br/>
                <input type="submit" onSubmit={handleSubmit}/>
            </form>
        </div>
    );
}