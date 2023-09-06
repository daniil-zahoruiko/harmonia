import { createContext, useState } from "react";
import { useToken } from "./components/utils/useToken";

const UserContext = createContext(null);

const GetUserValue = () => 
{
    const {setToken, token, removeToken} = useToken();
    const [userError, setUserError] = useState(null);
    const [userData,setUserData] = useState()

    const user = {
        access_token: [token, setToken, removeToken],
        error: [userError, setUserError],
        user_data:[userData,setUserData]
        // user_settings
    }

    return user;
}

export {UserContext, GetUserValue};