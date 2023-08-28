import { createContext } from "react";
import { useToken } from "./components/utils/useToken";

const UserContext = createContext(null);

const GetUserValue = () => 
{
    const {setToken, token, removeToken} = useToken();

    const user = {
        access_token: [token, setToken, removeToken]
        // user_data
        // user_settings
    }

    return user;
}

export {UserContext, GetUserValue};