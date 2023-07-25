#include "user.h"
#include <iostream>
#include <fstream>


ifstream f("../../data/user_data/users.json");
json users = json::parse(f);


// Change display name of the user
void User::changeDisplayName(){
    string newName;
    cout << "Change your full name: ";
    cin >> newName;
    display_name = newName;
}


// Change email of the user
void User::changeEmail(){
    string newEmail, confirmEmail;
    int quit;
    while(true){
        cout << "Change your email: ";
        cin >> newEmail;
        cout << "Confirm new email";
        cin >> confirmEmail;
        if(newEmail == confirmEmail){
            email = newEmail;
            break;
        }
        else{
            cout<<"\nEmails do not match with each other, try again\n";
        }
        cout << "Enter 1 to quit: ";
        cin >> quit;
        if(quit == 1){
            break;
        }
    }
}


// Change password of the user
void User::changePassword(){
    string newPassword, confirmPassword;
    int quit;
    while(true){
        cout << "Change your password: ";
        cin >> newPassword;
        cout << "Confirm new password";
        cin >> confirmPassword;
        if(newPassword == confirmPassword){
            password = newPassword;
            break;
        }
        else{
            cout<<"\nPasswords do not match with each other, try again\n";
        }
        cout << "Enter 1 to quit: ";
        cin >> quit;
        if(quit == 1){
            break;
        }
    }
}