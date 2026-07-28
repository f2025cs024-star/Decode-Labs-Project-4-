#include<iostream>
using namespace std;
class license {
    protected:
    string license_number;
    int expiry_year;
    public:
void setlicense(string ln, int expyear) {
    license_number = ln;
    expiry_year = expyear;
};

};
class vehicle {
    public:
    int vehicle_model;
    string vehicle_registration;
void setvehicle(int vm, string vr) {
    vehicle_model = vm;
    vehicle_registration = vr;
}
};
class driver : public license, public vehicle {
    public:
    void show(){
        cout << "the license number is " << license_number << endl;
        cout << "the expiry year is " << expiry_year << endl;
        cout << "the vehicle model is " << vehicle_model << endl;
        cout << "the vehicle registration is " << vehicle_registration << endl;
    }
};
int main(){
    driver d;
    d.setlicense("ABC8765" , 2024);
    d.setvehicle(2020 , "XYZ1234");
    d.show();
}