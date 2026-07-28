#include<iostream>
using namespace std;
class AC{
    int temp;
    public:
    AC(int temp=24){
        this->temp=temp;

    };
    AC operator++(){
        if(temp>30){
            cout<<"limit reached"<<endl;
            
        }
        else{
            temp++;
        };
        return AC(temp);

    };
    AC operator--(){
        if(temp<=16){
            cout<<"limit reached"<<endl;
            
        }
        else{
            temp--;
        };
        return AC(temp);
    };
    void display(){
        cout<<"current temperature of AC: "<<temp<<endl;

    };


    };
    int main(){
        AC A1(25);
        A1.display();
        cout<<"pressing the + button"<<endl;
        ++A1;
        A1.display();
    };
