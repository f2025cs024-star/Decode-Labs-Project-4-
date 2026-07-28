#include<iostream>
#include<string>
using namespace std;

class Calculator {
public:
    // Add three integers
    int add(int a, int b, int c) {
        return a + b + c;
    }

    // Add three floats
    float add(float a, float b, float c) {
        return a + b + c;
    }

    // Concatenate two strings
    string add(string a, string b) {
        return a + b;
    }
};

int main() {
    Calculator calc;

    cout << "Sum of integers: " << calc.add(1, 2, 3) << endl;
    cout << "Sum of floats: " << calc.add(1.5f, 2.5f, 3.0f) << endl;
    cout << "Concatenated string: " << calc.add("Hello ", "World") << endl;

    return 0;
}