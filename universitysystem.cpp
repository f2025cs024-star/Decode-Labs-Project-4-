#include<iostream>
using namespace std;

class Student {
private:
    string name;
    int marks;
    static int totalStudents;

public:
    Student(string name, int marks) {
        this->name = name;
        this->marks = marks;
        totalStudents++;
    }

    void display() {
        cout << "Name: " << name << endl;
        cout << "Marks: " << marks << endl;
    }

    static void showTotalStudents() {
        cout << "Total Students: " << totalStudents << endl;
    }

    // Friend class declaration
    friend class Teacher;
};

// Static member initialization
int Student::totalStudents = 0;

class Teacher {
public:
    void updateMarks(Student &s, int newMarks) {
        s.marks = newMarks;   // accessing private data
    }
};

int main() {
    Student s1("Ali", 70);
    Student s2("Ahmed", 80);

    Teacher t1;

    cout << "Before update:" << endl;
    s1.display();

    t1.updateMarks(s1, 90);

    cout << "\nAfter update:" << endl;
    s1.display();

    cout << endl;
    Student::showTotalStudents();

    return 0;
}