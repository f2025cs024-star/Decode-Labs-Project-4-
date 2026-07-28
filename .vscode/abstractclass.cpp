#include<iostream>
using namespace std;

class shape {
protected:
    float area = 0;
public:
    virtual void calc_area() = 0;   // pure virtual function
    virtual void display() = 0;     // pure virtual function
};

class circle : public shape {
protected:
    float radius;
public:
    circle(float radius) {
        this->radius = radius;
        calc_area();
    }

    void calc_area() override {
        area = 3.14 * radius * radius;
    }

    void display() override {
        cout << "The area of the circle is: " << area << endl;
    }
};

class rectangle : public shape {
protected:
    double length;
    double breadth;
public:
    rectangle(double length, double breadth) {
        this->length = length;
        this->breadth = breadth;
        calc_area();
    }

    void calc_area() override {
        area = length * breadth;
    }

    void display() override {
        cout << "The area of the rectangle is: " << area << endl;
    }
};

int main() {
    shape *a;

    a = new circle(9.8);
    a->display();

    a = new rectangle(2.8, 6.9);
    a->display();

    return 0;
}