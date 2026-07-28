#include<iostream>
using namespace std;
class loop{
    int n;
    public:
    void getdata(){
        cout<<"enter the number: ";
        cin>>n;

    };
    void display(){
        for(int i=n;i>=1;i--){
            cout<<i<<" ";
        };
    };
};
int main(){
    loop obj;
    obj.getdata();
    obj.display();
};