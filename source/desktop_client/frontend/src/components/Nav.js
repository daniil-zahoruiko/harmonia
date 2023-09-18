import {IoSettingsOutline} from "react-icons/io5"
import "../styles/nav.css"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const Nav = () =>{

    const [t,] = useTranslation("navbar")


    return(
        <nav className="desktop_nav">
            <ul>
                <li className="nav_outer nav_logo">
                    <Link to="/">
                        <div>
                            <p className="project_name nav_name">Harmonia</p>
                        </div>
                    </Link>
                </li>
                <li className="nav_li nav_left">
                    <Link to="/library">
                        <p>
                            {t("library")}
                        </p>
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        <svg className="user_logo" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <path d="M21 18V16C21 13.2386 23.2386 11 26 11V11C28.7614 11 31 13.2386 31 16V18" stroke="white" strokeWidth="2"/>
                            <path d="M14 37V32.5C14 26.1487 19.1487 21 25.5 21V21C31.8513 21 37 26.1487 37 32.5V37" stroke="white" strokeWidth="2"/>
                            <path d="M26 51C39.8071 51 51 39.8071 51 26C51 12.1929 39.8071 1 26 1C12.1929 1 1 12.1929 1 26C1 39.8071 12.1929 51 26 51Z" stroke="white" strokeWidth="2"/>
                        </svg>
                    </Link>
                </li>
                <li className="nav_li nav_right">
                    <Link to="/discover">
                        <p>
                            {t("discover")}
                        </p>
                    </Link>
                </li>
                <li className="nav_outer nav_settings">
                    <Link to="/settings">
                        <div>
                            <IoSettingsOutline className="settings_svg"/>
                        </div>
                    </Link>
                </li>
            </ul>
        </nav>

    )
}