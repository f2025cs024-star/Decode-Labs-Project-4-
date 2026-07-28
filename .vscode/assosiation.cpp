#include<iostream>
using namespace std;

class patient {
    string name;
    string disease;
public:
    patient(string name, string disease) {
        this->name = name;
        this->disease = disease;
    }

    string getName() {
        return name;
    }

    string getDisease() {
        return disease;
    }
};

class doctor {
    string name;
    string specialization;
public:
    doctor(string name, string specialization) {
        this->name = name;
        this->specialization = specialization;
    }

    void consult(patient &p) {
        cout << "The doctor: " << name << " is treating the patient " << p.getName()
             << " for the disease: " << p.getDisease() << endl;
    }
};

int main() {
    doctor d1("talha", "cardiology");
    patient p1("ashar", "sugar");

    d1.consult(p1);

    return 0;
}