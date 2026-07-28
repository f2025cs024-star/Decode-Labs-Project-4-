#include<iostream>
using namespace std;

class Room {
private:
    float length;
    float width;

public:
    // Default constructor
    Room() {
        length = 0;
        width = 0;
    }

    // Parameterized constructor
    Room(float l, float w) {
        length = l;
        width = w;
    }

    void setDimensions(float l, float w) {
        length = l;
        width = w;
    }

    float calculateArea() {
        return length * width;
    }

    void display() {
        cout << "Length: " << length << ", Width: " << width << endl;
        cout << "Area: " << calculateArea() << " sq ft" << endl;
    }
};

int main() {
    Room r1(12.5, 10.0);
    cout << "Room 1:" << endl;
    r1.display();

    Room r2;
    r2.setDimensions(8.0, 6.5);
    cout << "Room 2:" << endl;
    r2.display();

    return 0;
}