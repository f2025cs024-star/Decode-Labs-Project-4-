#include<iostream>
using namespace std;
class A{
    int a;
    int b;
    string name;
    public:
    A(){
        cout<<"Default constructor called"<<endl;
    }
};
int main(){
    A obj;
    return 0;
}