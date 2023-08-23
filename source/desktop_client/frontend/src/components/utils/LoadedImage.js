


export const LoadedImage = ({src, className, alt}) =>{
    const [loaded,setLoaded] = useState(false)

    return(
        <>
            {loaded?null:<div style={{backgroundColor:"red",height:"10vw",width:"10vw"}}/>}
            <img className={className} alt={alt} onLoad={()=>setLoaded(true)} style={loaded?{}:{display:"none"}} src={src} />
        </>
    )
}