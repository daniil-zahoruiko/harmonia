import { useState, useContext } from "react"
import { LogMeIn, updateData } from "../../api";
import { UserContext } from "../../UserContext";
import {useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { changeDataSchema } from "../utils/ValidationSchemas";
import {IoArrowBackCircleOutline} from "react-icons/io5"
import "../../styles/changedata.css"
import { SongsContext } from "../../SongsData";

export const ChangeData = () =>
{
    const { access_token: [,,removeToken],
        error: [, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        settings:[settings,setSettings] } = useContext(UserContext);

    const [error, setError] = useState(null);

    const {
        access_token: [token, setToken,]
    } = useContext(UserContext)

    const {register, handleSubmit, watch, formState: {errors}} = useForm({
        defaultValues:{
            username: username,
            email: email,
            fullName:fullName
        },
        resolver:yupResolver(changeDataSchema)
    })

    async function onSubmit(data)
    {
        await updateData({setToken: setToken, username: username,email:email,fullName:fullName, input:data})
        .then(() => setError(null))
        .catch((error) => setError(error.message));
        window.location.reload(false);
    }



    return(
        <div className="change_data_wrapper">
            <form className="change_data_form" onSubmit={handleSubmit(onSubmit)}>
                <h1>¡Change your data!</h1>
                <div className="form_row">
                    <label htmlFor="username">
                        New Username:
                    </label>
                    <div className="login_form_input_wrapper">
                        <input className="login_input" id="username"  placeholder="Username" {...register("username")} />
                    </div>
                    <p className="form_error">{errors.username?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        New Email:
                    </label>
                    <div className="login_form_input_wrapper">
                        <input className="login_input" id="email"  placeholder="Password" {...register("email")} />
                    </div>
                    <p className="form_error">{errors.email?.message}</p>
                </div>
                <div className="form_row">
                    <label htmlFor="email">
                        New Full Name:
                    </label>
                    <div className="login_form_input_wrapper">
                        <input className="login_input" id="email"  placeholder="Password" {...register("fullName")} />
                    </div>
                    <p className="form_error">{errors.fullName?.message}</p>
                </div>
                {error != null ? <p className="login_error">{error}</p> : null}
                <input id="submit" type="submit" value="Change data"/>
            </form>
        </div>
    );
}