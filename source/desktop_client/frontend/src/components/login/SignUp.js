import { useState } from "react";
import { LoggedOut } from "../home/LoggedOut";

export const SignUp = ({selectedAction, setSelectedAction}) =>
{
    const [signUpForm, setSignUpForm] = useState({
        "username": "",
        "password": "",
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
        setSelectedAction("Main");
    }

    return(
        <div>
            <button onClick={() => setSelectedAction("Main")}>Back</button>
            <form onSubmit={handleSubmit}>
                <label>
                    Username: 
                    <input name="username" onChange={handleChange} placeholder="Username" value={signUpForm.username} />
                </label>
                <br />
                <label>
                    Password: 
                    <input name="password" onChange={handleChange} placeholder="Password" value={signUpForm.password} />
                </label>
                <br />
                <label>
                    Email: 
                    <input name="email" onChange={handleChange} placeholder="Email" value={signUpForm.email} />
                </label>
                <br />
                <label>
                    Full Name: 
                    <input name="full_name" onChange={handleChange} placeholder="Full Name" value={signUpForm.full_name} />
                </label>
                <br />
                <label>
                    Display Name: 
                    <input name="display_name" onChange={handleChange} placeholder="Display Name" value={signUpForm.display_name} />
                </label>
                <br />
                <input type="submit" value="Sign Up"/>
            </form>
        </div>
    );
}