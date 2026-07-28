#include<iosttream>
using namespace std;
class Payment{
    protected:
    string account_holder_name;
    int payment_ID;
    float payment_amount;
    string payment_mode;
    public:
    void transaction_fee();
    void payment_method(){
         cout<<"enter the payment method you want to use: "<<endl;
         cout<<"1. Credit_card"<<endl;
         cout<<"2. Debit Card"<<endl;
         cout<<"3. Paypal"<<endl;
    }
};
class credit_card{
    void transaction_fee(){
        transaction_fee=payment_amount*0.02;
    };
};
class debit_card{
    void transaction_fee(){
        transaction_fee=0.0;
    };
};
class paypal{

}