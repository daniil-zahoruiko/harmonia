import { useState, useContext } from "react"
import { LogMeIn } from "../../api";
import { UserContext } from "../../UserContext";
import {useForm} from "react-hook-form"
import {IoArrowBackCircleOutline} from "react-icons/io5"
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import "../../styles/login.css"

export const LogIn = ({selectedAction, setSelectedAction}) =>
{

    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [error, setError] = useState(null);   

    const {
        access_token: [token, setToken,]
    } = useContext(UserContext)

    const {register, handleSubmit, watch, formState: {errors}} = useForm({
        defaultValues:{
            username: "",
            password: "",
        }
    })

    async function onSubmit(data)
    {
        await LogMeIn({setToken: setToken, setError: setError, username: data.username, password:data.password})
        .then(() => setError(null))
        .catch((error) => setError(error.message));
    }
    
    const passwordToggle = () =>{
        setPasswordVisibility(!passwordVisibility)
    }


    return(
        <main className="logged_out_background">
            <button className="back_wrapper" onClick={() => setSelectedAction("Main")}><IoArrowBackCircleOutline className="back_wrapper_svg"/></button>
            <form className="log_in_wrapper" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Welcome back!</h1>
                <div>
                    <label htmlFor="username">
                        Username:
                    </label>
                    <input className="login_input" id="username"  placeholder="Username" {...register("username")} />
                    <p></p>
                </div>
                <div>
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input className={`login_input ${passwordVisibility?"":"hide_pass"}`} id="password"  placeholder="Password" {...register("password")} />
                    <p></p>
                    {passwordVisibility?<AiOutlineEye onClick={passwordToggle} className="pass_visibility"/>:<AiOutlineEyeInvisible onClick={passwordToggle} className="pass_visibility"/>}
                </div>
                {error != null ? <p>{error}</p> : null}
                <div className="login_submit_button">
                    <input id="submit" type="submit" value="Log In"/>
                </div>
            </form>
        </main>
    );
}