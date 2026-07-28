#include<iostream>
using namespace std;
class Array{
    int a,b;
    public:
    void getdata(){
        cout << "Enter two numbers: " << endl;
        cin >> a >> b;
    };
    void display(){
        cout << "The sum of the two numbers is: " << a + b << endl;

    };

};
int main(){
    Array arr[5];
    for (int i=0;i<5;i++){
        arr[i].getdata();
    };
    for (int i=0;i<5;i++){
        arr[i].display();
    };
};