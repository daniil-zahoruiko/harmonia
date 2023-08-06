import "../../styles/leftbar.css"
import { PlaylistLB } from "./PlaylistLB"
import {IoChevronBackCircleSharp,IoChevronForwardCircleSharp} from "react-icons/io5"
import { useState } from "react"
import { MainWindow } from "../MainWindow"


export const LeftBar = (userPlaylists) => {
    const [lbState, setLbState] = useState("full")

    const hideLb = () =>{
        const mainWindowElement = document.getElementsByClassName("main_window_wrapper")
        const mainWindowStyle = mainWindowElement[0].style
        const leftBarElement = document.getElementsByClassName("left_bar_wrapper")
        const leftBarStyle = leftBarElement[0].style
        if(lbState === "hidden"){
            setLbState("full")
            mainWindowStyle.gridArea = "2 / 3 / 3 / -1"
            leftBarStyle.gridArea = "2 / 1 / 3 / 3"
        }else{
            setLbState("hidden")
            leftBarStyle.gridArea = "2 / 1 / 3 / 2"
            mainWindowStyle.gridArea = "2 / 2 / 3 / -1"
        }
    }

    return(
        <div className="left_bar_wrapper">
            {lbState === "full"?<IoChevronBackCircleSharp onClick={hideLb} className="lb_hider"/>
            :<IoChevronForwardCircleSharp onClick={hideLb} className={`lb_hider hider_${lbState}`}/>}
            <div className="left_bar_topic_wrapper">
                <div>
                    <svg className="lb_svg" xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                        <path d="M14.5 27C21.4036 27 27 21.4036 27 14.5C27 7.59644 21.4036 2 14.5 2C7.59644 2 2 7.59644 2 14.5C2 21.4036 7.59644 27 14.5 27Z" stroke="white" stroke-width="3"/>
                        <path d="M14 14L20 16" stroke="white" stroke-width="3"/>
                        <path d="M14.069 14.5V5.44827" stroke="white" stroke-width="3"/>
                    </svg>
                </div>
                <div className={"left_bar_topic_text lb_"+lbState}>
                    <p>
                        Recently played
                    </p>
                </div>
            </div>
            <div className="left_bar_topic_wrapper">
                <div>
                    <svg className="lb_svg" xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 25" fill="none">
                        <path d="M14.9143 23L4.07093 11.3177C1.88669 8.96447 2.19948 5.24256 4.74584 3.28689V3.28689C5.69808 2.55555 6.86517 2.15909 8.06584 2.15909H9.13896C12.2142 2.15909 14.7071 4.65205 14.7071 7.72727V7.72727" stroke="white" stroke-width="3"/>
                        <path d="M14.9143 23L25.2456 11.1544C27.2984 8.80066 26.9932 5.21445 24.572 3.24159V3.24159C23.5865 2.43853 22.3541 2 21.0828 2H20.6416C17.4785 2 14.9143 4.56419 14.9143 7.72727V7.72727" stroke="white" stroke-width="3"/>
                    </svg>
                </div>
                <div className={"left_bar_topic_text lb_"+lbState}>
                    <p>
                        Liked songs
                    </p>
                </div>
            </div>
            <div className="left_bar_topic_wrapper">
                <div>
                    <svg className="lb_svg" xmlns="http://www.w3.org/2000/svg" width="33" height="44" viewBox="0 0 33 44" fill="none">
                        <path d="M16.3219 13.5507L6.11435 29.0662C5.8079 29.532 6.02287 30.1743 6.54327 30.3478C6.82524 30.4418 7.13345 30.3707 7.3488 30.1621L20.5872 17.3374C21.8521 16.112 21.7494 13.9995 20.3712 12.897C19.0847 11.8677 17.2324 12.1668 16.3219 13.5507Z" stroke="white" stroke-width="3"/>
                        <path d="M24.5 2C28.0899 2 31 4.91015 31 8.5C31 12.0899 28.0899 15 24.5 15C20.9101 15 18 12.0899 18 8.5C18 4.91015 20.9101 2 24.5 2Z" stroke="white" stroke-width="3"/>
                        <path d="M6.01113 30.3333V30.3333C5.4794 30.7797 5.82833 31.6944 6.51301 31.8092C7.58121 31.9882 8.20464 32.4344 6.93235 33.3956C6.18219 33.9623 5.3606 34.5585 4.56849 35.1213C2.36114 36.6895 -1.06878 38.891 1.01972 40.6143C1.08326 40.6667 1.15023 40.7196 1.22077 40.7729C1.27488 40.8138 1.32726 40.8534 1.37796 40.8918C2.55965 41.7871 1.33738 42.1607 0.115299 43V43" stroke="white" stroke-width="0.4"/>
                    </svg>
                </div>
                <div className={"left_bar_topic_text lb_"+lbState}>
                    <p>
                        Favourite artists
                    </p>
                </div>
            </div>
            <PlaylistLB lbState={lbState} userPlaylists={userPlaylists.userPlaylists}/>
        </div>
    )
}