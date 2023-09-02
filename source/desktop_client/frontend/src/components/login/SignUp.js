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

    const {
        access_token: [token, setToken,]
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
        await SignMeUp({username: data.username, password: data.password})
        await LogMeIn({token: token, setToken: setToken, username: data.username, password: data.password})
        setSelectedAction("Main");

        console.log(data)
    }

    const passwordToggle = () =>{
        setPasswordVisibility(!passwordVisibility)
    }

    return(
        <main className="logged_out_background">
            <button className="back_wrapper" onClick={() => setSelectedAction("Main")}><IoArrowBackCircleOutline className="back_wrapper_svg"/></button>
            <form className="sign_up_wrapper" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Sing Me Up!</h1>
                <div>
                    <label htmlFor="username">
                        Username:
                    </label>
                    <input className={`signing_input ${errors.username?"invalid":""}`} id="username"  placeholder="Username" {...register("username")} />
                    <p>{errors.username?.message}</p>
                </div>
                <div>
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input className={`signing_input ${errors.password?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="password"  placeholder="Password" {...register("password")} />
                    {passwordVisibility?<AiOutlineEye onClick={passwordToggle} className="pass_visibility"/>:<AiOutlineEyeInvisible onClick={passwordToggle} className="pass_visibility"/>}
                    <p>{errors.password?.message}</p>
                </div>
                <div>
                    <label htmlFor="passwordConfirmation">
                        Confirm password:
                    </label>
                    <input className={`signing_input ${errors.passwordConfirmation?"invalid":""} ${passwordVisibility?"":"hide_pass"}`} id="passwordConfirmation"  placeholder="Confirm password" {...register("passwordConfirmation")}/>
                    <p>{errors.passwordConfirmation?.message}</p>
                </div>
                <div>
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input className={`signing_input ${errors.email?"invalid":""}`} id="email"  placeholder="Email" {...register("email")}/>
                    <p>{errors.email?.message}</p>
                </div>
                <div>
                    <label htmlFor="fullName">
                        Full Name:
                    </label>
                    <input className={`signing_input ${errors.fullName?"invalid":""}`} id="fullName"  placeholder="Full Name" {...register("fullName")} />
                    <p>{errors.fullName?.message}</p>
                </div>
                <div className="signing_submit_button">
                    <input id="submit" type="submit" value="Create account"/>
                </div>
            </form>
        </main>
    );
}