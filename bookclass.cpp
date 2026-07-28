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
    }

    void display() {
        cout << "Title: " << title << endl;
        cout << "Author: " << author << endl;
        cout << "Price: " << price << endl;
    }
};

int main() {
    Book b1("C++ Basics", "Ali Khan", 500);
    b1.display();
    return 0;
}