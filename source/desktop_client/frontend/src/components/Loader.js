import "../styles/loader.css"
import HashLoader from "react-spinners/HashLoader"


export const Loader = ()=>{

    return(
        <main className="loader-main">
            <div className="loader">
                <HashLoader size={150} color="#44489F" />
            </div>
        </main>
    )
}