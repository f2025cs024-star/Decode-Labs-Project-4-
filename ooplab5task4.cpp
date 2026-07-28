#include<iostream>
using namespace std;

class Counter {
private:
    int value;

public:
    Counter(int v) {
        value = v;
    }

    void operator--() {
        value--;
    }

    void display() {
        cout << "Value: " << value << endl;
    }
};

int main() {
    Counter c(10);
    cout << "Original: ";
    c.display();

    --c;
    cout << "After decrement: ";
    c.display();

    return 0;
}