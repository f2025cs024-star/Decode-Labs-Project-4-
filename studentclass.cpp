#include <iostream>
using namespace std;

class Student {
    string name;
    int age;

public:
    Student() {
        name = "Unknown";
        age = 0;
        cout << "Default constructor used to initialize student record" << endl;
    }

    void display() {
        cout << "Student Name: " << name << endl;
        cout << "Student Age: " << age << endl;
    }
};

int main() {
    Student s1;
    s1.display();
    return 0;
}