import { useContext } from "react"
import { UserContext } from "../../UserContext"
import { LogMeOut } from "../../api";

export default () => {
    const {access_token: [,,removeToken]} = useContext(UserContext);

    function handleLogOut()
    {
        LogMeOut()

        removeToken();
    }

    return(
        <div>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
}