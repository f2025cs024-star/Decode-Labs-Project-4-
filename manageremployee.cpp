#include<iostream>
using namespace std;

// Base class
class Person {
public:
    string name;

    void identify() {
        cout << "Name: " << name << " (Person)" << endl;
    }
};

// Derived class 1
class Employee : public Person {
protected:
    int employeeID;

public:
    void setEmployee(int id) {
        employeeID = id;
    }

    void work() {
        if (employeeID % 2 == 0)
            cout << "Employee " << name << " is working on backend systems" << endl;
        else
            cout << "Employee " << name << " is working on frontend systems" << endl;
    }
};

// Derived class 2
class Manager : public Employee {
private:
    int teamSize;

public:
    void setManager(int size) {
        teamSize = size;
    }

    void manage() {
        if (teamSize > 5)
            cout << "Manager " << name << " manages a large team" << endl;
        else
            cout << "Manager " << name << " manages a small team" << endl;
    }
};

int main() {
    Manager m;

    m.name = "Ali";
    m.setEmployee(7);     // odd → frontend
    m.setManager(6);      // >5 → large team

    m.identify();
    m.work();
    m.manage();

    return 0;
}