import * as yup from "yup";

export const signUpSchema = yup.object({
    username: yup.string().required("No username provided."),
    password: yup.string()
        .required('No password provided.') 
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    passwordConfirmation: yup.string()
        .required("No password provided.")
        .oneOf([yup.ref("password"),null],"Passwords must match"),
    email: yup.string()
        .required("No email provided")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"),
    fullName: yup.string().required("No full name provided")
}).required();

// export const logInSchema = yup.object({
//     username: yup.string().required("No username provided."),
//     password: yup.string()
//         .required('No password provided.') 
//         .min(8, 'Password is too short - should be 8 chars minimum.')
//         .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
//     passwordConfirmation: yup.string().oneOf([yup.ref("password"),null],"Passwords must match"),
//     email: yup.string()
//         .required("No email provided")
//         .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"),
//     fullName: yup.string().required("No full name provided")
// }).required();