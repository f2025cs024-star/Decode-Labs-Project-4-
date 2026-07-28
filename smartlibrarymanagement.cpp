#include <iostream>
using namespace std;

class LibraryMember {
private:
    string name;
    int borrowedBooks;

public:
    void setMember(string n) {
        name = n;
        borrowedBooks = 0;
    }

    void borrowBook() {
        borrowedBooks++;
    }

    void returnBook() {
        if (borrowedBooks > 0)
            borrowedBooks--;
        else
            cout << "No books to return!" << endl;
    }

    void status() {
        cout << "Member: " << name << endl;
        cout << "Books Borrowed: " << borrowedBooks << endl;
    }
};

int main() {
    LibraryMember m;
    m.setMember("Sara");
    m.borrowBook();
    m.borrowBook();
    m.returnBook();
    m.status();

    return 0;
}