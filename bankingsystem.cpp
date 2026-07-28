#include<iostream>
using namespace std;
class bankaccount{
    string accountnumber;
    int balance;
    public:
    bankaccount(string accountnumber,int balance){
        this->accountnumber=accountnumber;
        this->balance=balance;
    };
    void deposit(int amount){
        balance+=amount;

    };
    void withdraw(int amount){
        if(amount>balance){
            cout<<"insuffiecient balance"<<endl;
        }else{
            balance=balance-amount;
        }
        };
        void display(){
            cout<<"account number: "<<accountnumber<<endl;
            cout<<"balance: "<<balance<<endl;
        };
    };

int main(){
    bankaccount b1("PK87654321",6700);
    b1.withdraw(6000);
    b1.display();
}