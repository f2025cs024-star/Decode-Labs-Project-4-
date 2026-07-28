#include<iostream>
using namespace std;
class car{
    int topspeed=240;
    string enhginenumber="V8973333";
    friend class engine;

};
class engine{
    public:
    void display(car c){
        cout<<"top speed of the car is "<<c.topspeed<<endl;
        cout<<"engine number of the car is "<<c.enhginenumber<<endl;
    };
};
int main(){
    car c1;
    engine e1;
    e1.display(c1);
}