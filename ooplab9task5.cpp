#include <iostream>
#include <string>
using namespace std;

class Employee
{
private:
    string name;

public:
    Employee(string n) : name(n)
    {
    }

    void showRole()
    {
        cout << "Employee Name: " << name << endl;
        cout << "Role: Employee" << endl;
    }

    string getName()
    {
        return name;
    }
};

class Manager : public Employee
{
public:
    Manager(string n) : Employee(n)
    {
    }

    void showRole()
    {
        cout << "Manager Name: " << getName() << endl;
        cout << "Role: Manager" << endl;
    }
};

int main()
{
    Manager m("Ahmed");

    cout << "Using Manager object:" << endl;
    m.showRole();

    cout << "\nUsing Employee pointer:" << endl;
    Employee* emp = &m;
    emp->showRole();

    return 0;
}