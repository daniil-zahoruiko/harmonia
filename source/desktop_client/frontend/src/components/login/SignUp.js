import { useState, useContext } from "react";
import { SignMeUp, LogMeIn } from "../../api";
import { UserContext}  from "../../UserContext";

export const SignUp = ({ selectedAction, setSelectedAction}) =>
{
    const {
        access_token: [token, setToken,]
    } = useContext(UserContext)

    const [signUpForm, setSignUpForm] = useState({
        "username": "",
        "password": "",
        "confirm_password": "",
        "email": "",
        "full_name": "",
        "display_name": ""
    })

    function handleChange(event)
    {
        const {value, name} = event.target
        setSignUpForm((prev) => ({
            ...prev, [name]: value
        }));
    }

    function handleSubmit()
    {
        SignMeUp({username: signUpForm.username, password: signUpForm.password});

        LogMeIn({token: token, setToken: setToken, username: signUpForm.username, password: signUpForm.password});

        setSelectedAction("Main");
    }

    return(
        <div>
            <button onClick={() => setSelectedAction("Main")}>Back</button>
            <form onSubmit={handleSubmit}>
                <label>
                    Username: 
                    <div>
                        <input name="username" onChange={handleChange} placeholder="Username" value={signUpForm.username} />
                    </div> 
                </label>
                <br />
                <label>
                    Password: 
                    <div>
                        <input name="password" onChange={handleChange} placeholder="Password" value={signUpForm.password} />
                    </div>
                </label>
                <br />
                <label>
                    Confirm password: 
                    <div>
                        <input name="confirm_password" onChange={handleChange} placeholder="Confirm password" value={signUpForm.confirm_password} />
                    </div>
                </label>
                <br />
                <label>
                    Email:
                    <div> 
                        <input name="email" onChange={handleChange} placeholder="Email" value={signUpForm.email} />
                    </div>
                </label>
                <br />
                <label>
                    Full Name:
                    <div> 
                        <input name="full_name" onChange={handleChange} placeholder="Full Name" value={signUpForm.full_name} />
                    </div>
                </label>
                <br />
                <label>
                    Display Name:
                    <div> 
                        <input name="display_name" onChange={handleChange} placeholder="Display Name" value={signUpForm.display_name} />
                    </div>
                </label>
                <br />
                <div>
                    <input type="submit" value="Sign Up"/>
                </div>
            </form>
        </div>
    );
}