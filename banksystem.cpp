#include <iostream>
using namespace std;

class LoanDepartment;

class BankAccount
{
private:
    double balance;

public:
    BankAccount(double b)
    {
        balance = b;
        cout << "Account created with balance: " << balance << endl;
    }

    ~BankAccount()
    {
        cout << "Account closed" << endl;
    }

    friend class LoanDepartment;
};

class LoanDepartment
{
public:
    void checkLoan(BankAccount &acc)
    {
        if (acc.balance >= 50000)
            cout << "Loan Approved" << endl;
        else
            cout << "Loan Not Approved" << endl;
    }
};

int main()
{
    double bal;
    cout << "Enter your bank balance: ";
    cin >> bal;

    BankAccount customer(bal);
    LoanDepartment loan;

    loan.checkLoan(customer);

    return 0;
}