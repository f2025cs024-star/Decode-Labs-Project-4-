#include <iostream>
#include <string>
using namespace std;

class Appliance
{
private:
    string name;

public:
    Appliance(string n) : name(n)
    {
    }

    string getName()
    {
        return name;
    }
};

class WashingMachine : public Appliance
{
private:
    float loadCapacity;

public:
    WashingMachine(string n, float capacity) : Appliance(n), loadCapacity(capacity)
    {
    }

    void display()
    {
        cout << "Appliance Name: " << getName() << endl;
        cout << "Load Capacity: " << loadCapacity << " kg" << endl;
    }
};

int main()
{
    WashingMachine wm("Samsung Washer", 8.5);
    wm.display();

    return 0;
}