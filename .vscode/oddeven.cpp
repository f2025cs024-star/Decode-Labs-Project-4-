#include<iostream>
using namespace std;
class oddeven{
    int a;
    public:
    void getdata(){
        cout<<"enter the number: ";
        cin>>a;
    };
        void display(){
            if(a%2==0){
                cout<<"even number"<<endl;
            }
                else{
                    cout<<"odd number"<<endl;
                }
            };
        };
        
    int main(){
        oddeven obj;
        obj.getdata();
        obj.display();

    };