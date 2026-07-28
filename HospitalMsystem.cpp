#include<iostream>
using namespace std;
class Hospital{
    string name;
    int age;
    string disease;
    double fee;
    public:
    void getdata(){
        cout<<"enter the name of patient: "<<endl;
        cin>>name;
        cout<<"enter the age of patient: "<<endl;
        cin>>age;
        cout<<"enter the disease of patient: "<<endl;
        cin>>disease;
        cout<<"enter the fee of patient: "<<endl;
        cin>>fee;
    };
    void display(){
        cout<<"the name of patient is: "<<name<<endl;
        cout<<"the age of patient is: "<<age<<endl;
        cout<<"the disease of patient is: "<<disease<<endl;
        cout<<"the fee of patient is: "<<fee<<endl;
    };
    void displayhighestfee(Hospital H[5]){
        double highestfee=0;
        for(int i=0;i<5;i++){
            if(H[i].fee>highestfee){
                highestfee=H[i].fee;
            }
        }
        cout<<"the highest fee is: "<<highestfee<<endl;
    };
};
int main(){
    Hospital H[5];
    for(int i=0;i<5;i++){
        H[i].getdata();
    };
    for(int i=0;i<5;i++){
        H[i].display();
    };
    H[0].displayhighestfee(H);
    return 0;

};