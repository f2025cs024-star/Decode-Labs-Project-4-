#include <iostream>
using namespace std;

class Book {
    string title;
    string author;
    float price;

public:
    Book(string t, string a, float p) {
        title = t;
        author = a;
        price = p;
        cout << "Parameterized constructor for Book executed" << endl;
    }

    void display() {
        cout << "Title: " << title << endl;
        cout << "Author: " << author << endl;
        cout << "Price: " << price << endl;
    }
};

class Point {
    int x;
    int y;

public:
    Point(int a, int b) {
        x = a;
        y = b;
        cout << "Original Point object created" << endl;
    }

    Point(const Point &p) {
        x = p.x;
        y = p.y;
        cout << "Copy constructor called" << endl;
    }

    void display() {
        cout << "Coordinates: (" << x << ", " << y << ")" << endl;
    }
};

int main() {
    Book b1("OOP Concepts", "Ahmed Raza", 750);
    b1.display();

    Point p1(5, 10);
    Point p2 = p1;

    p1.display();
    p2.display();

    return 0;
}