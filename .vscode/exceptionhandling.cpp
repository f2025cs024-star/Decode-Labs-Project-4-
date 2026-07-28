#include<iostream>
using namespace std;

class ATM {
public:
    float balance;
    string name;

    ATM(float balance, string name) {
        this->balance = balance;
        this->name = name;
    }

    void withdraw(float amount) {
        if (amount <= 0) {
            throw "Invalid amount";
        }
        else if (amount > balance) {
            throw "Insufficient funds";
        }
        else {
            balance -= amount;
            cout << "Withdrawal successful. Remaining balance: " << balance << endl;
        }
    }

    void deposit(float amount) {
        if (amount <= 0) {
            throw "Invalid amount";
        }
        else {
            balance += amount;
            cout << "Deposit successful. New balance: " << balance << endl;
        }
    }
};

int main() {
    ATM A1(25000, "Talha");

    try {
        A1.deposit(2000);
        A1.withdraw(29000);   // exceeds balance -> throws
        A1.deposit(1000);     // never reached
    }
    catch (const char* e) {
        cout << "Exception occurred: " << e << endl;
    }

    return 0;
}