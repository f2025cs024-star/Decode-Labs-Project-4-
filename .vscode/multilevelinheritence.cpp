#include<iostream>
using namespace std;
class Person{
    protected:
    string name;
    int age;
    public:
    void introduce(){
        cout<<"Hello, my name is "<<name<<" and I am "<<age<<" years old."<<endl;
    };
};
class employee:public Person{
    protected:
    int employee_id;
    int salary;
    public:
    void showsalary(){
        cout<<"My salary is "<<salary<<" dollars per month."<<endl;
    };
};
class manager:public employee{
    protected:
    string department;
    int team_size;
    float bonus=0;
    public:
    void comductmeeting(){
        cout<<"I am conducting a meeting for the "<<department<<" department."<<endl;
    };
    void bonus_calculate(){
        if (team_size>5){
            bonus=salary*0.20;
        }
        else{
            bonus=salary*0.10;
        }
    };
    manager(string name, int age, int employee_id, int salary, string department, int team_size){
        this->name=name;
        this->age=age;
        this->employee_id=employee_id;
        this->salary=salary;
        this->department=department;
        this->team_size=team_size;
        bonus_calculate();
        
    };
    void display(){
        introduce();
        cout<<"Employee ID: "<<employee_id<<endl;
        showsalary();
        comductmeeting();
        cout<<"Department: "<<department<<endl;
        cout<<"Team Size: "<<team_size<<endl;
        cout << "Bonus: $" << bonus << endl;
    };
};
int main(){
    manager m1("Alice", 35, 101, 5000, "Sales", 8);
    m1.display();
    return 0;
};