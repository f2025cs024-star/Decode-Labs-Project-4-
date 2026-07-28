#include<iostream>
using namespace std;

class Car {
public:
    int speed;

    Car(int s) {
        speed = s;
    }
};

// Pass by value - original not changed
void increaseByValue(Car c) {
    c.speed += 50;
    cout << "Inside value function: " << c.speed << endl;
}

// Pass by reference - original is changed
void increaseByReference(Car &c) {
    c.speed += 50;
    cout << "Inside reference function: " << c.speed << endl;
}

int main() {
    Car car1(100);

    cout << "Original speed: " << car1.speed << endl;

    increaseByValue(car1);
    cout << "After pass by value: " << car1.speed << endl;

    increaseByReference(car1);
    cout << "After pass by reference: " << car1.speed << endl;

    return 0;
}