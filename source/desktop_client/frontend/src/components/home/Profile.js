import { useContext } from "react"
import { UserContext } from "../../UserContext"
import { LogMeOut } from "../../api";
import { SongsContext } from "../../SongsData";

export default () => {
    const { access_token: [,,removeToken],
        error: [, setUserError],
        username:[username,setUsername],
        email:[email,setEmail],
        full_name:[fullName,setFullName],
        password:[password,setPassword],
        settings:[settings,setSettings] } = useContext(UserContext);


    const { page:[currentPage,setCurrentPage]} = useContext(SongsContext)

    function handleLogOut()
    {
        LogMeOut({removeToken});
    }

    return(
        <div>
            <h1>{fullName}</h1>
            <p>#{username}</p>
            <p>{email}</p>
            <button onClick={()=>setCurrentPage("change-data")}>Change data</button>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
}