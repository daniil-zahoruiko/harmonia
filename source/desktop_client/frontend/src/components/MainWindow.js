import { Home } from "./home/Home"
import "../styles/mainWindow.css"



export const MainWindow = ({songs,currentIndex,setCurrentIndex}) => {
    return(
        <div className="main_window_wrapper">
            <Home songs = {songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
        </div>
    )
}