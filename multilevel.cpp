#include<iostream>
using namespace std;

// Base class
class computer{
protected:
    string brand;

public:
    computer(string b){
        brand = b;    
    }

    void showbrand(){
        cout << "Computer brand: " << brand << endl;
    }       
};
class laptop : public computer{
protected:
    float weight;

public:
    laptop(string b, float w) : computer(b){
        weight = w;
    }

    void showweight(){
        cout << "Laptop weight: " << weight << " kg" << endl;
    }
};

class gamingLaptop : public laptop{
private:
    int gpuMemory;

public:
    gamingLaptop(string b, float w, int g) : laptop(b, w){
        gpuMemory = g;
    }

    void showDetails(){
        showbrand();     
        showweight();    
        cout << "GPU Memory: " << gpuMemory << " GB" << endl;
    }
};

int main(){
    gamingLaptop g1("Dell", 2.5, 8);
    g1.showDetails();

    return 0;
}