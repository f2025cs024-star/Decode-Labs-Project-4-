#include<iostream>
using namespace std;
class Bank_Account{
    string name;
    int account_number;
    int balance;
    string accounttype;
    public:
    static int total_accounts;
    Bank_Account(string name,int account_number,int balance,string accounttype){
        this->name=name;
        this->account_number=account_number;
        this->balance=balance;
        this->accounttype=accounttype;
        total_accounts++;
    };
    void printdetails(){
        cout<<"Name: "<<name<<endl;
        cout<<"Account Number: "<<account_number<<endl;
        cout<<"Balance: "<<balance<<endl;
        cout<<"Account Type: "<<accounttype<<endl;
        cout<< "Total accounts: "<<total_accounts<<endl;
    };
    
};
int Bank_Account::total_accounts=0;
int main(){
    Bank_Account account1("Alice", 12345, 1000, "Savings");
    Bank_Account account2("Bob", 67890, 2000, "Checking");
    account1.printdetails();
    cout<<endl;
    account2.printdetails();
    cout<<endl;
    
    return 0;
}
