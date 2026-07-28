#include <iostream>
using namespace std;

class Employee {
private:
    int id;
    string name;
    float monthlySalary;

public:
    void setData(int i, string n, float s) {
        id = i;
        name = n;
        monthlySalary = s;
    }

    void display() {
        cout << "ID: " << id << endl;
        cout << "Name: " << name << endl;
        cout << "Monthly Salary: " << monthlySalary << endl;
    }

    float yearlySalary() {
        return monthlySalary * 12;
    }
};

int main() {
    Employee e;
    e.setData(101, "Ahmed", 60000);
    e.display();
    cout << "Yearly Salary: " << e.yearlySalary() << endl;

    return 0;
}