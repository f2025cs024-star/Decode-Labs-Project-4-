#include<iostream>
using namespace std;
class vending_machine{
    protected:
    string select;
    float amount;
    virtual void selectproduct(string select)=0;
    virtual void insertpayment(float amount)=0;
    virtual void dispenseitem()=0;
};
class snack:public vending_machine{
    
      
}
