#include<iostream>
using namespace std;
class Bank{
    string name;
    int account_number;
    int *balance;
    public:
    Bank(string n, int acc_num, int bal){
        name=n;
        account_number=acc_num;
        balance= new int;
        *balance=bal;
    };
    ~Bank(){
        delete balance;
        cout << "Destructor called, memory released." << endl;
    };
    void DISPLAY(){
        cout<<"Name: "<<name<<endl;
        cout<<"Account Number: "<<account_number<<endl;
        cout<<"Balance: "<<*balance<<endl;
    }
};
int main(){
    Bank b1("John Doe", 2349876, 15000);
    b1.DISPLAY();
    

}