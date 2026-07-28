#include<iostream>
using namespace std;
class Talha{
     int a,b;
    public:
    void getdata(){
        cout<<"enter two numbers: "<<endl;
        cin>>a>>b;

    };
    void display(){
        cout<<"the number a is: "<<a<<" and the number b is: "<<b<<endl;

};
};
int main(){
    Talha aa[4];
    for (int i = 0; i < 4; i++) {
        aa[i].getdata();
    };
    for (int i = 0; i < 4; i++) {
        aa[i].display();
    };
    return 0;
};