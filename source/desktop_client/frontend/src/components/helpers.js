

export const getValues = (object) =>{
    return Object.keys(object).map((key)=>{return object[key]})
}