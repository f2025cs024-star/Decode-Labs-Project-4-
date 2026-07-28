#include<iostream>
using namespace std;

class Membership {
public:
    virtual void calculateFee() = 0;
};

class BasicMembership : public Membership {
public:
    void calculateFee() {
        cout << "Basic Membership Fee: Rs. 500/month" << endl;
    }
};

class PremiumMembership : public Membership {
public:
    void calculateFee() {
        cout << "Premium Membership Fee: Rs. 1500/month" << endl;
    }
};

class FamilyMembership : public Membership {
public:
    void calculateFee() {
        cout << "Family Membership Fee: Rs. 2500/month" << endl;
    }
};

int main() {
    Membership* m1 = new BasicMembership();
    Membership* m2 = new PremiumMembership();
    Membership* m3 = new FamilyMembership();

    m1->calculateFee();
    m2->calculateFee();
    m3->calculateFee();

    delete m1;
    delete m2;
    delete m3;

    return 0;
}