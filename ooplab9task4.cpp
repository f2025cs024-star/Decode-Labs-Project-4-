#include <iostream>
using namespace std;

class Payment
{
public:
    virtual void processPayment()
    {
    }
};

class CreditCard : public Payment
{
public:
    void processPayment()
    {
        cout << "Processing payment through Credit Card..." << endl;
    }
};

class UPI : public Payment
{
public:
    void processPayment()
    {
        cout << "Processing payment through UPI..." << endl;
    }
};

class Cash : public Payment
{
public:
    void processPayment()
    {
        cout << "Processing payment through Cash..." << endl;
    }
};

int main()
{
    CreditCard cc;
    UPI upi;
    Cash cash;

    Payment* payments[3];
    payments[0] = &cc;
    payments[1] = &upi;
    payments[2] = &cash;

    for (int i = 0; i < 3; i++)
    {
        payments[i]->processPayment();
    }

    return 0;
}