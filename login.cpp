#include<iostream>
using namespace std;
class loginsystem{
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
int main(){
    loginsystem L1;
    L1.setpassword("1234");
    L1.verifypassword("1235");
    return 0;
}