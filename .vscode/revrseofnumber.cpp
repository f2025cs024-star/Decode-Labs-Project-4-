#include<iostream>
using namespace std;
class reverse{
    int n;
    public:
    void getdata(){
        cout<<"enter the number: ";
        cin>>n;
    };
    void display(){
        int rev=0;
        while (n>0)
        {
            rev=rev*10+n%10;
            n=n/10;
        }        cout<<"reverse of the number is: "<<rev;
    };
    };
int main(){
    reverse rev;
    rev.getdata();
    rev.display();
}