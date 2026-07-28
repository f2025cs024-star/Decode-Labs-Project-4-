#include<iostream>
using namespace std;
class Bankaccount{
    string name;
    int account_number;
    int balance;
    string accounttype;
    static int total_accounts;
    static int total_balance;
    public:
    Bankaccount(string name,int account_number,int balance,string accounttype){
        this->name=name;
        this->account_number=account_number;
        this->balance=balance;
        this->accounttype=accounttype;
        total_accounts++;
        total_balance+=balance;
    };
    void deposit(int amount){
        balance+=amount;
        total_balance+=amount;
    };
    void withdraw(int amount){
        if(amount<=balance && amount>0){
            cout<<"WIthdraw successfull"<<endl;
            balance=balance-amount;
            total_balance=total_balance-amount;
        } else{
            cout<<"Insufficient balance or invalid amount"<<endl;
        };
    };
    static void totalaccounts(){
         cout<<"Total accounts: "<<total_accounts<<endl;
    };
    static void totalbalance(){
        cout<<"Total balance: "<<total_balance<<endl;
    };
    void print(){
        cout<<"Name: "<<name<<endl;
        cout<<"Account Number: "<<account_number<<endl;
        cout<<"Balance: "<<balance<<endl;
        cout<<"Account Type: "<<accounttype<<endl;
    };
};
int Bankaccount::total_accounts=0;
int Bankaccount::total_balance=0;
int main(){
    Bankaccount B1("Alice", 12345, 1000, "Savings");
    Bankaccount B2("Bob", 67890, 2000, "Checking");
    Bankaccount B3("Charlie", 54321, 1500, "Savings");
    B1.print();
    B2.print();
    B3.print();
    
    B1.deposit(1500);
    B2.withdraw(1500);
    B3.deposit(1000);
    Bankaccount::totalaccounts();
    Bankaccount::totalbalance();
}