import "../../styles/dropdown.css"



export const DropDown = ({inputs,title,chooseAlbum}) =>{
    return(
        <div className="dd-wrapper">
            <div className="dd-header-title">
                <p>{title}</p>
            </div>
            <div className="dd-list">
                {inputs.map((input,key)=>{
                    return <div key={key} className="dd-list-item">
                            <p onClick={input==="Pick existing album"?chooseAlbum:{}}>
                                {input}
                            </p>
                        </div>
                })}
            </div>
        </div>
    )
}