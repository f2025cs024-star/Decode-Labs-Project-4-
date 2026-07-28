#include<iostream>
using namespace std;
class A{
    public:
    void show(){
        cout<<"hello talha"<<endl;
}
    };

class B{
    public:
    void show(){
        cout<<"hello world"<<endl;
    }
    
};
class Child:public A,public B{
    public:
    void show(){
        A::show(); 
        B::show();
    }
};
int main(){
    Child c1;
    c1.show();
    return 0;
}
