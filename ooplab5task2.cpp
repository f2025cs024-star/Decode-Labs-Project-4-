#include<iostream>
#include<string>
using namespace std;

class Book {
private:
    string title;

public:
    Book(string t) {
        title = t;
    }

    friend void showBookTitle(Book b);
};

void showBookTitle(Book b) {
    cout << "Book Title: " << b.title << endl;
}

int main() {
    Book b1("The C++ Programming Language");
    showBookTitle(b1);
    return 0;
}