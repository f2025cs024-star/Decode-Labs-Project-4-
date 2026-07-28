#include<iostream>
#include<string>
using namespace std;

class Employee {
private:
    int empId;
    double salary;

public:
    void setEmployee(int id, double s) {
        empId = id;
        if (s >= 0) {
            salary = s;
        } else {
            cout << "Invalid salary entered!" << endl;
            salary = 0;
        }
    }

    void updateSalary(double newSalary) {
        if (newSalary >= 0) {
            salary = newSalary;
        } else {
            cout << "Invalid salary!" << endl;
        }
    }

    void display() {
        cout << "Employee ID: " << empId << endl;
        cout << "Salary: " << salary << endl;
    }
};

int main() {
    Employee e1;
    e1.setEmployee(201, 55000);
    e1.display();
    e1.updateSalary(-1000);
    e1.updateSalary(60000);
    e1.display();
    return 0;
}