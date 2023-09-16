import { useState, useEffect } from "react";

function useToken()
{
    const [token, setToken] = useState("");
    useEffect(() =>{
        getRefreshedToken().then((data) => { if(data) setToken(data) });
    }, [])

    function saveToken({accessToken, refreshToken})
    {
        localStorage.setItem("refreshToken", refreshToken);
        setToken(accessToken);
    }

    async function getRefreshedToken()
    {
        const refreshToken = localStorage.getItem("refreshToken");

        if(refreshToken === null || refreshToken === "")
        {
            return null;
        }

        const response = await fetch("/refresh_token", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + refreshToken,
            }
        }).then((response) => {
            if(!response.ok)
                throw new Error(response.status);
            return response;
        }).catch((error) => {
            console.log("Error " + error.message + " occured while refreshing token");
            setToken("");
        });

        const jsonResponse = await response.json();

        return jsonResponse.access_token;
    }

    async function refreshToken()
    {
        const newToken = await getRefreshedToken(refreshToken);

        setToken(newToken);

        return token;
    }   

    function removeToken()
    {
        localStorage.removeItem("refreshToken");
        setToken(null);
    }

    return {
        setToken: saveToken,
        token,
        refreshToken,
        removeToken
    }
}

export {useToken}