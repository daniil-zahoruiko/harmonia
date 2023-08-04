import { Home } from "./home/Home"
import "../styles/mainWindow.css"



export const MainWindow = (props) => {
    console.log(props)
    return(
        <div className="main_window_wrapper">
            <Home songs = {props.songs}/>
        </div>
    )
}