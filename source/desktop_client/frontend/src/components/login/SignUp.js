import { useState, useContext } from "react";
import { SignMeUp, LogMeIn } from "../../api";
import { UserContext}  from "../../UserContext";
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from "../utils/ValidationSchemas";
import {IoArrowBackCircleOutline} from "react-icons/io5"
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import "../../styles/signup.css"

export const SignUp = ({ selectedAction, setSelectedAction}) =>
{

    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [error, setError] = useState(null);

    const {
        access_token: [token, setToken,],
        user_data:[userData,setUserData]
    } = useContext(UserContext)

    const {register, handleSubmit, watch, formState: {errors}} = useForm({
        defaultValues:{
            username: "",
            password: "",
            passwordConfirmation: "",
            email: "",
            fullName: ""
        },
        resolver:yupResolver(signUpSchema)
    })

    async function onSubmit(data)
    {
        console.log(data)
        await SignMeUp({username: data.username, password: data.password,email:data.email,full_name:data.fullName})
        .then(async () => {
            await LogMeIn({token: token,setUserData:setUserData, setToken: setToken, username: data.username, password: data.password})
            .then(() => setError(null))
        })
        .catch((error) => setError(error.message));
    }

    const passwordToggle = () =>{
        setPasswordVisibility(!passwordVisibility)
    }

    return(
        <main className="logged_out_background">
            <button className="back_wrapper" onClick={() => setSelectedAction("Main")}><IoArrowBackCircleOutline className="back_wrapper_svg"/></button>
            <form className="sign_up_wrapper" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Sing Me Up!</h1>
                <div className="form_row">
                    <label htmlFor="username">
                        Username:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.username?"invalid":""}`} id="username"  placeholder="Username" {...register("username")} />
                    </div>
                    <p className="form_error">{errors.username?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.password?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="password"  placeholder="Password" {...register("password")} />
                        {passwordVisibility?<AiOutlineEye onClick={passwordToggle} className="pass_visibility"/>:<AiOutlineEyeInvisible onClick={passwordToggle} className="pass_visibility"/>}
                    </div>
                    <p className="form_error">{errors.password?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="passwordConfirmation">
                        Confirm password:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.passwordConfirmation?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="passwordConfirmation"  placeholder="Confirm password" {...register("passwordConfirmation")}/>
                    </div>
                    <p className="form_error">{errors.passwordConfirmation?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        Email:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.email?"invalid":""}`} id="email"  placeholder="Email" {...register("email")}/>
                    </div>
                    <p className="form_error">{errors.email?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="fullName">
                        Full Name:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.fullName?"invalid":""}`} id="fullName"  placeholder="Full Name" {...register("fullName")} />
                    </div>
                    <p className="form_error">{errors.fullName?.message}</p>
                </div>
                {error != null ? <p className="login_error">{error}</p> : null}
                <input id="submit" type="submit" value="Create account"/>
            </form>
        </main>
    );
}