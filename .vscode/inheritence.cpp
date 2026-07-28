#include<iostream>
using namespace std;
class Bankaccount{
    protected:
    int account_number;
    string account_holder_name;
    float balance;

};
class savingaccount:public Bankaccount{
    float interest_rate=0;
    public:
    void interest_calculation(){
        if(balance>1000){
            interest_rate=balance*0.05;
        };

    };
    savingaccount(int account_number, string account_holder_name, float balance){
        this->account_number=account_number;
        this->account_holder_name=account_holder_name;
        this->balance=balance;
        interest_calculation();
        
    };
    void display(){
        cout<<"Account Number: "<<account_number<<endl;
        cout<<"Account Holder Name: "<<account_holder_name<<endl;
        cout<<"Balance: "<<balance<<endl;
        cout<<"Interest Rate: "<<interest_rate<<endl;
    };
    
};
class currentaccount:public Bankaccount{
    float overdraft_limit=0;
    public:
    void overdraft_limit_calulation(){
        if (balance>5000){
            overdraft_limit=balance*0.10;
        }
    };
    currentaccount(int account_number, string account_holder_name, float balance){
        this->account_number=account_number;
        this->account_holder_name=account_holder_name;
        this->balance=balance;
        overdraft_limit_calulation();
    };
    void display(){
        cout<<"Account Number: "<<account_number<<endl;
        cout<<"Account Holder Name: "<<account_holder_name<<endl;
        cout<<"Balance: "<<balance<<endl;
        cout<<"Overdraft Limit: "<<overdraft_limit<<endl;
    };
};
int main(){
    savingaccount s1(12345,"John Doe",1500);
    s1.display();
    currentaccount c1(54321,"Jane Doe",8000);
    c1.display();
    return 0;
};
