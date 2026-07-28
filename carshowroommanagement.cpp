#include<iostream>
#include<string>
using namespace std;

class Car {
private:
    string brand;
    int topSpeed;

public:
    void setBrand(string b) {
        brand = b;
    }

    void setTopSpeed(int s) {
        topSpeed = s;
    }

    string getBrand() {
        return brand;
    }

    int getTopSpeed() {
        return topSpeed;
    }

    void displayInfo() {
        cout << "Brand: " << brand << endl;
        cout << "Top Speed: " << topSpeed << " km/h" << endl;
    }
};

int main() {
    Car c1, c2;
    c1.setBrand("Toyota");
    c1.setTopSpeed(180);

    c2.setBrand("Honda");
    c2.setTopSpeed(200);

    cout << "--- Car 1 ---" << endl;
    c1.displayInfo();

    cout << "--- Car 2 ---" << endl;
    c2.displayInfo();

    return 0;
}