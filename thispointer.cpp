#include<iostream>
using namespace std;
class Employee{
    public:
    string name;
    int salary;
    int workinghours;
    Employee(string name,int salary, int workinghours){
        this->name=name;
        this->salary=salary;
        this->workinghours=workinghours;
    };
   void print (int workinghours){
    cout<<" " << name << " has an annual salary of: "<< salary <<" and is currently working for: "<< this->workinghours<< " hours" << endl;
    cout << "the working hours avearge for month is: " << workinghours << endl;
   
};
};
int main(){
    Employee e1("Talha", 100000, 8);
    Employee e2("Waseem", 120000, 12);
    e1.name="Arshad";
e1.print(5);
e2.print(7);
}