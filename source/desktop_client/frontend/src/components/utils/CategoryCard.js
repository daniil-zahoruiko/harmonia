import { Link } from "react-router-dom"

export const CategoryCard = ({onClick,category}) => {
    return(
        <Link to="/playlist" onClick={onClick} className="category_card">
            <h1 className="category_header">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        </Link>
    )
}