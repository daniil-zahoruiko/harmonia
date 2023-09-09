import * as yup from "yup";

function PasswordSignUp (message) {
    return this.test("PasswordChange", message, function(value){
        const {path, createError} = this;
        let error = ""
        const lowCaseRegEx = /[a-z]/
        const upCaseRegEx = /[A-Z]/
        const digitRegEx = /[0-9]/
        if(value.length<8){
            error = "Password is too short - should be 8 chars minimum"
        }
        else if(value.search(lowCaseRegEx)<0){
            error = "Your password must contain at least one lower case letter"
        }
        else if(value.search(upCaseRegEx)<0){
            error = "Your password must contain at least one upper case letter"
        }
        else if(value.search(digitRegEx)<0){
            error = "Your password must contain at least one number"
        }
        if(error === "") return true
        return createError({ path, message: error  });
    });
}
function PasswordChange (message) {
    return this.test("PasswordChange", message, function(value){
        const {path, createError} = this;
        let error = ""
        const lowCaseRegEx = /[a-z]/
        const upCaseRegEx = /[A-Z]/
        const digitRegEx = /[0-9]/
        if(value.length === 0){
            return true
        }
        else if(value.length<8){
            error = "Password is too short - should be 8 chars minimum"
        }
        else if(value.search(lowCaseRegEx)<0){
            error = "Your password must contain at least one lower case letter"
        }
        else if(value.search(upCaseRegEx)<0){
            error = "Your password must contain at least one upper case letter"
        }
        else if(value.search(digitRegEx)<0){
            error = "Your password must contain at least one number"
        }
        if(error === "") return true
        return createError({ path, message: error  });
    });
};

yup.addMethod(yup.string, "PasswordChange", PasswordChange);
yup.addMethod(yup.string, "PasswordSignUp", PasswordSignUp);

export const signUpSchema = yup.object({
    username: yup.string().required("No username provided."),
    password: yup.string()
        .required('No password provided.')
        .PasswordSignUp(),
    passwordConfirmation: yup.string()
        .required("No password provided.")
        .oneOf([yup.ref("password"),null],"Passwords must match"),
    email: yup.string()
        .required("No email provided")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"),
    fullName: yup.string().required("No full name provided")
}).required();

export const logInSchema = yup.object({
    username: yup.string().required("No username provided."),
    password: yup.string()
        .required('No password provided.')
}).required();




export const changeDataSchema = yup.object({
    username: yup.string().required("No username provided."),
    password: yup.string()
        .PasswordChange(),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref("password"),null],"Passwords must match"),
    email: yup.string()
        .required("No email provided")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"),
    fullName: yup.string().required("No full name provided")
}).required();