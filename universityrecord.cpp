#include<iostream>
#include<string>
using namespace std;

class Student {
private:
    int id;
    string name;
    float gpa;

public:
    void setData(int i, string n, float g) {
        id = i;
        name = n;
        gpa = g;
    }

    void displayData() {
        cout << "Student ID: " << id << endl;
        cout << "Name: " << name << endl;
        cout << "GPA: " << gpa << endl;
    }
};

int main() {
    Student s1;
    s1.setData(101, "Ali Hassan", 3.7);
    s1.displayData();
    return 0;
}