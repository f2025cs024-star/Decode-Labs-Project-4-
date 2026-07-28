#include<iostream>
using namespace std;

class A {
    int a;
    int b;
    
public:
    // Default constructor
    A() {}

    // Parameterized constructor (Fixed the semicolon to a comma)
    A(int a, int b) {
        this->a = a;
        this->b = b;
        cout << "Constructor called" << endl;
    }

    // Destructor
    ~A() {
        cout << "Destructor called " << a << " " << b << endl;
    }
};

int main() {
    A obj1(10, 20);
    A obj2(30, 40);
    A *obj3 = new A(50, 60); 
    // Dynamically allocated object
    delete obj3; // Don't forget to free the dynamically allocated memory
    return 0;
}