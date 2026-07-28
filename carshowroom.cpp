#include <iostream>
using namespace std;

class Car {
private:
    string color;
    string model;
    float price;

public:
    void setCar(string c, string m, float p) {
        color = c;
        model = m;
        price = p;
    }

    void updatePrice(float p) {
        price = p;
    }

    void display() {
        cout << "Model: " << model << endl;
        cout << "Color: " << color << endl;
        cout << "Price: " << price << endl;
    }

    string getColor() {
        return color;
    }
};

int main() {
    Car c;
    c.setCar("Black", "Civic", 5500000);
    c.display();

    cout << "Car Color: " << c.getColor() << endl;

    return 0;
}