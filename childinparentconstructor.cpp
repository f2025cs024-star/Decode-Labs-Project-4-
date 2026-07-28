#include<iostream>
using namespace std;
class computer{
    protected:
    string brand;
    public:
    computer(string b){
        brand=b;    
    }
    void showbrand(){
        cout<<"computer brand: "<<brand<<endl;
    }       
};
class laptop:public computer{
    private:
    float weight;
    public:
    laptop(string b, float w):computer(b){
        weight=w;
    }
};
int main(){
    laptop l1("Dell", 2.5);
    l1.showbrand();
    return 0;
};
