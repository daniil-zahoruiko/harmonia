import {SongCard} from "./SongCard"


export const CategoryCard = ({onClick,category}) => {
    return(
        <div onClick={onClick} className="category_card">
            <h1 className="category_header">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        </div>
    )
}