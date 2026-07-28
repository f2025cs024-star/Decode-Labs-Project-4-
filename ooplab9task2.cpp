#include <iostream>
using namespace std;

class Device
{
public:
    virtual void performAction()
    {
    }
};

class Printer : public Device
{
public:
    void performAction()
    {
        cout << "Printing document..." << endl;
    }
};

class Scanner : public Device
{
public:
    void performAction()
    {
        cout << "Scanning page..." << endl;
    }
};

int main()
{
    Printer p;
    Scanner s;

    Device* device = &p;
    device->performAction();

    device = &s;
    device->performAction();

    return 0;
}