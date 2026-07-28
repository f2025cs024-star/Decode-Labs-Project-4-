#include<iostream>
using namespace std;

class Weight {
private:
    float kg;

public:
    Weight(float k) {
        kg = k;
    }

    Weight addWeight(Weight w) {
        Weight total(kg + w.kg);
        return total;
    }

    void show() {
        cout << "Total Weight: " << kg << " kg" << endl;
    }
};

int main() {
    Weight w1(50), w2(25);
    Weight w3 = w1.addWeight(w2);
    w3.show();
    return 0;
}