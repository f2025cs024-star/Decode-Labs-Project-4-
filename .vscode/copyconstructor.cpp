#include <iostream>
using namespace std;
class Doctor{
    string name;
    int age;
    string department;
    public:
    inline Doctor(string n, int a, string d): name(n), age(a), department(d){
        
    };
    Doctor(Doctor &d){
        name=d.name;
        age=d.age;
        department=d.department;
    };
    void display(){
        cout<<"Name: "<<name<<endl;
        cout<<"Age: "<<age<<endl;
        cout<<"Department: "<<department<<endl;
    };
};
int main(){
    Doctor D1("Summaya", 30, "paediatrics");
    Doctor D2(D1);
    D1.display();
    D2.display();
    return 0;
};
