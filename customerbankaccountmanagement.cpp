#include<iostream>
#include<string>
using namespace std;

class BankAccount {
private:
    int accountNo;
    string ownerName;
    double balance;

public:
    void setAccount(int no, string name, double bal) {
        accountNo = no;
        ownerName = name;
        if (bal >= 0) {
            balance = bal;
        } else {
            cout << "Invalid balance!" << endl;
            balance = 0;
        }
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited: " << amount << endl;
        } else {
            cout << "Invalid deposit amount!" << endl;
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "Withdrawn: " << amount << endl;
        } else {
            cout << "Invalid withdrawal!" << endl;
        }
    }

    void display() {
        cout << "Account No: " << accountNo << endl;
        cout << "Owner: " << ownerName << endl;
        cout << "Balance: " << balance << endl;
    }
};

int main() {
    BankAccount acc;
    acc.setAccount(3001, "Sara Khan", 10000);
    acc.display();

    acc.deposit(5000);
    acc.withdraw(3000);
    acc.withdraw(20000);

    cout << "--- Updated Info ---" << endl;
    acc.display();

    return 0;
}Z