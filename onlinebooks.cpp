#include <iostream>
using namespace std;

class Book {
private:
    string title;
    string author;
    float price;

public:
    void setDetails(string t, string a, float p) {
        title = t;
        author = a;
        price = p;
    }

    void updatePrice(float p) {
        price = p;
    }

    void display() {
        cout << "Title: " << title << endl;
        cout << "Author: " << author << endl;
        cout << "Price: Rs. " << price << endl;
    }
};

int main() {
    Book b;
    b.setDetails("C++ Basics", "Bjarne", 1200);
    b.display();

    cout << "\nAfter update:\n";
    b.updatePrice(1500);
    b.display();

    return 0;
}