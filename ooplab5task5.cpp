#include<iostream>
using namespace std;

class Number {
private:
    int value;

public:
    Number(int v) {
        value = v;
    }

    Number operator/(Number n) {
        if (n.value != 0) {
            Number result(value / n.value);
            return result;
        } else {
            cout << "Cannot divide by zero!" << endl;
            Number result(0);
            return result;
        }
    }

    void display() {
        cout << "Result: " << value << endl;
    }
};

int main() {
    Number n1(100), n2(4);
    Number n3 = n1 / n2;
    n3.display();
    return 0;
}