#ifndef _USER_H_
#define _USER_H_

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std;

class User{
    public:
        void changeDisplayName();
        void changeEmail();
        void changePassword();
    private:
        string username;
        string display_name;
        string email;
        string password;
        string description;
        string country;
        string gender;
        json settings;
        json preferences;

        // Constructor
        User(string username, string display_name, string email, string password, string country, string gender,string description = "",
        json settings = R"({
            "light_mode":false,
            "subscription":false,
            "privacy":false,
            "bass":"medium",
            "language":"english"
        })"_json,
        json preferences = R"({
            "song_style":"",
            "fav_artist":""
        })"_json)
        {
            this->username = username;
            this->display_name = display_name;
            this->email = email;
            this->password = password;
            this->country = country;
            this->gender = gender;
            this->description = description;
            this->settings = settings;
            this->preferences = preferences;
        }
};
#endif //_USER_H_