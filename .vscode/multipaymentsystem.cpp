#include<iostream>
using namespace std;

class Payment {
public:
    virtual void processPayment() = 0;
};

class CreditCardPayment : public Payment {
public:
    void processPayment() {
        cout << "Processing Credit Card Payment..." << endl;
        cout << "Payment successful via Credit Card." << endl;
    }
};

class UPIPayment : public Payment {
public:
    void processPayment() {
        cout << "Processing UPI Payment..." << endl;
        cout << "Payment successful via UPI." << endl;
    }
};

class CryptoPayment : public Payment {
public:
    void processPayment() {
        cout << "Processing Cryptocurrency Payment..." << endl;
        cout << "Payment successful via Cryptocurrency." << endl;
    }
};

int main() {
    Payment* p1 = new CreditCardPayment();
    Payment* p2 = new UPIPayment();
    Payment* p3 = new CryptoPayment();

    p1->processPayment();
    cout << endl;
    p2->processPayment();
    cout << endl;
    p3->processPayment();

    delete p1;
    delete p2;
    delete p3;

    return 0;
}