#include <iostream>
using namespace std;

class Wallet {
private:
    string name;
    float balance;

public:
    void setUser(string n) {
        name = n;
        balance = 0;
    }

    void addMoney(float amount) {
        balance += amount;
    }

    void makePayment(float amount) {
        if (amount <= balance)
            balance -= amount;
        else
            cout << "Insufficient balance!" << endl;
    }

    void showBalance() {
        cout << "User: " << name << endl;
        cout << "Balance: Rs. " << balance << endl;
    }
};

int main() {
    Wallet w;
    w.setUser("Ali");
    w.addMoney(2000);
    w.makePayment(500);
    w.showBalance();

    return 0;
}