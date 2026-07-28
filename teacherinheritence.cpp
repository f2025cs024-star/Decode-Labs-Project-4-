#include<iostream>
using namespace std;
class Person {
protected:
    string name;
    int age;

public:
    void setPerson(string n, int a) {
        name = n;
        age = a;
    }
};
class Subject {
protected:
    string subjectName;
    int hours;

public:
    void setSubject(string s, int h) {
        subjectName = s;
        hours = h;
    }
};
class Teacher : public Person, public Subject {
public:
    void display() {
        cout << "Teacher Name: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "Subject: " << subjectName << endl;
        cout << "Hours Taught: " << hours << endl;
    }
};
int main() {
    Teacher t;

    t.setPerson("Ali", 35);
    t.setSubject("Mathematics", 20);

    t.display();

    return 0;
}
