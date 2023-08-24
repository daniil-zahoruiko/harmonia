import { useState } from "react";

function useToken()
{
    function getToken()
    {
        const currentToken = localStorage.getItem("token");
        return currentToken ?? "";
    }

    const [token, setToken] = useState(getToken());

    function saveToken(currentToken)
    {
        localStorage.setItem("token", currentToken);
        setToken(currentToken);
    }

    function removeToken()
    {
        localStorage.removeItem("token");
        setToken(null);
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}

export {useToken}