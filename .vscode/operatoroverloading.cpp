#include<iostream>
using namespace std;
class complex{
    int real;
    int imaginary;
    public:
    complex(){};

    complex(int real, int imaginary){
        this->real=real;
        this->imaginary=imaginary;
    };
    void show(){
        cout<<real<<"+"<<imaginary<<"i"<<endl;

    };
    complex operator+(complex &c){
        complex merged;
        merged.real=real+c.real;
        merged.imaginary=imaginary+c.imaginary;
        return merged;
    };
};
int main(){
    complex c1(2,3);
    complex c2(7,8);
    complex c3;
    c3=c1+c2;
    c1.show();
    c2.show();
    c3.show();

};