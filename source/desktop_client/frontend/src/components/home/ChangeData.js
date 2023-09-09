import { useState, useContext } from "react"
import { LogMeIn, updateData } from "../../api";
import { UserContext } from "../../UserContext";
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { changeDataSchema } from "../utils/ValidationSchemas";
import {IoArrowBackCircleOutline} from "react-icons/io5"
import "../../styles/changedata.css"
import { SongsContext } from "../../SongsData";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"

export const ChangeData = () =>
{
    const { access_token: [,,removeToken],
        error: [, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        settings:[settings,setSettings] } = useContext(UserContext);


    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [error, setError] = useState(null);

    const {
        access_token: [token, setToken,]
    } = useContext(UserContext)

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues:{
            username: username,
            email: email,
            fullName:fullName,
            password:"",
            passwordConfirmation:""
        },
        resolver:yupResolver(changeDataSchema)
    })

    async function onSubmit(data)
    {
        await updateData({token: token, username: username,email:email,fullName:fullName, input:data})
        .then(() => setError(null))
        .catch((error) => setError(error.message));
        window.location.reload(false);
        console.log(data)
    }

    const passwordToggle = () =>{
        setPasswordVisibility(!passwordVisibility)
    }


    return(
        <div className="change_data_wrapper">
            <form className="change_data_form" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Change your data!</h1>
                <div className="form_row">
                    <label htmlFor="username">
                        New Username:
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
                        New Email:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.email?"invalid":""}`} id="email"  placeholder="Password" {...register("email")} />
                    </div>
                    <p className="form_error">{errors.email?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        New Full Name:
                    </label>
                    <div className="form_input_wrapper">
                        <input className={`signing_input ${errors.fullName?"invalid":""}`} id="email"  placeholder="Password" {...register("fullName")} />
                    </div>
                    <p className="form_error">{errors.fullName?.message}</p>
                </div>
                {error != null ? <p className="login_error">{error}</p> : null}
                <div className="change_data_button_wrapper">
                    <input
                        type="button"
                        onClick={() => reset(
                            {
                                username: username,
                                email: email,
                                fullName:fullName,
                                password:"",
                                passwordConfirmation:""
                            }
                        )}
                        id="cancel_change"
                        value="Cancel"
                    />
                    <input id="submit_change" type="submit" value="Change data"/>
                </div>
            </form>
        </div>
    );
}