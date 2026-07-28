#include<iostream>
using namespace std;
class Car{
    public:
    string ownername;
    int model;
    string problem;
    Car(string ownername,int model,string problem){
        this->ownername=ownername;
        this->model=model;
        this->problem=problem;
    };
    void display(){
        cout<<"the owner name is: "<<ownername<<endl;
        cout<<"the model of car is: "<<model<<endl;
        cout<<"the problem of car is: "<<problem<<endl;
    };
};
class Mechanic{
    string name;
    public:
    Mechanic(string name){
        this->name=name;
    };
    void solution(Car& C){
        cout<<"the owner of car is: " <<C.ownername<<endl;
        cout<<"the model of car is: "<<C.model<<endl;
        cout<<"the problem of car is: "<<C.problem<<endl;
        if(C.problem=="engine"){
            cout<<"the solution is: "<<name<<" will fix the engine problem."<<endl;
        }
        else if(C.problem=="tire"){
            cout<<"the solution is: "<<name<<" will fix the tire problem."<<endl;
        }
        else if(C.problem=="brake"){
            cout<<"the solution is: "<<name<<" will fix the brake problem."<<endl;
        }
        else{
            cout<<"the solution is: "<<name<<" will diagnose the problem further."<<endl;
        }
    };
};
int main(){
    Car C("Ali",2020,"engine");
    Mechanic M("Ahmed");
    M.solution(C);
    return 0;
};