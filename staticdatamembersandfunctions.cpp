#include<iostream>
#include<string>
using namespace std;

class Employee {
private:
    string name;
    static int count;

public:
    Employee(string n) {
        name = n;
        count++;
    }

    static void showCount() {
        cout << "Total Employees: " << count << endl;
    }
};

int Employee::count = 0;

int main() {
    Employee e1("Ali");
    Employee e2("Sara");
    Employee e3("Ahmed");

    Employee::showCount();

    return 0;
}