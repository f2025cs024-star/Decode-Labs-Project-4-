#include<iostream>
using namespace std;
class Inventory{
    string name;
    int quantity;
    public:
    Inventory(){};
    Inventory(string name,int quantity){
        this->name=name;
        this->quantity=quantity;

    };
    void print(){
        cout<<"the name of the product is: "<<name<<" and the quantity is: "<<quantity<<endl;

    };
    Inventory operator+(Inventory &I){
        int new_quantity=this->quantity+I.quantity;
        return Inventory(this->name, new_quantity);
    };
    Inventory operator-(Inventory &i){
        int new_quantity=this->quantity-i.quantity;
        if(new_quantity<0 ){
            new_quantity=0;
             cout<< "the product: "<<name<< " is out of stock:"<<endl;
        }
       
        return Inventory(this->name,new_quantity);
    };
};
int main(){
    Inventory I1("Hair dryer",1);
    Inventory I2("Hair dryer",6);
    Inventory I3;
    I3=I1+I2;
    I3.print();
    Inventory I4("Hair dryer",10);
    Inventory I5;
    I5=I2-I4;
    I5.print();
    return 0;
};
