#include<iostream>
using namespace std;
class loginsystem{
    string username;
    string password;
    public:
    void setpassword(string password){
        this->password = password;

    };
    void verifypassword(string password){
        if(password==this->password){
            cout<<"login successful"<<endl;
        }else{
            cout<<"login failed"<<endl;
        }
    }
};