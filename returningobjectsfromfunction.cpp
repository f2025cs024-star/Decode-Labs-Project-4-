#include<iostream>
using namespace std;

class Box {
private:
    int volume;

public:
    Box(int v) {
        volume = v;
    }

    Box combine(Box b) {
        Box result(volume + b.volume);
        return result;
    }

    void display() {
        cout << "Volume: " << volume << endl;
    }
};

int main() {
    Box b1(30), b2(20);
    Box b3 = b1.combine(b2);
    cout << "Combined ";
    b3.display();
    return 0;
}