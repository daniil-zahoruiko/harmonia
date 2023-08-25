import { useState } from "react"

export const LogIn = ({token, setToken, selectedAction, setSelectedAction}) =>
{
    const [logInForm, setLogInForm] = useState({
        "username": "",
        "password": ""
    });

    function handleSubmit()
    {
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
                    <input name="username" placeholder="Username" value={logInForm.username} onChange={handleChange}/>
                </label>
                <br/>
                <label>
                    Password:
                    <input name = "password" placeholder="Password" value={logInForm.password} onChange={handleChange}/>
                </label>
                <br/>
                <input type="submit" onSubmit={handleSubmit}/>
            </form>
        </div>
    );
}