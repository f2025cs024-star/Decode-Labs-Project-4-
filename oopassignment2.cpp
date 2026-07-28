#include<iostream>
#include<cmath>
using namespace std;

class Calculator {
    float a, b;
    string historyOp[5];
    float historyRes[5];
    int count;

public:
    Calculator() {
        a = 0;
        b = 0;
        count = 0;
    }

    Calculator(float x, float y) {
        a = x;
        b = y;
        count = 0;
    }

    void saveHistory(string op, float result) {
        if (count < 5) {
            historyOp[count] = op;
            historyRes[count] = result;
            count++;
        } else {
            for (int i = 0; i < 4; i++) {
                historyOp[i] = historyOp[i + 1];
                historyRes[i] = historyRes[i + 1];
            }
            historyOp[4] = op;
            historyRes[4] = result;
        }
    }

    void showHistory() {
        cout << "\n--- Last Operations ---" << endl;
        if (count == 0) {
            cout << "No operations yet." << endl;
            return;
        }
        for (int i = 0; i < count; i++) {
            cout << i + 1 << ". " << historyOp[i] << " = " << historyRes[i] << endl;
        }
    }

    float add() {
        float result = a + b;
        saveHistory("Add", result);
        return result;
    }

    float add(float x, float y) {
        float result = x + y;
        saveHistory("Add", result);
        return result;
    }

    float sub() {
        float result = a - b;
        saveHistory("Sub", result);
        return result;
    }

    float sub(float x, float y) {
        float result = x - y;
        saveHistory("Sub", result);
        return result;
    }

    float multiply() {
        float result = a * b;
        saveHistory("Multiply", result);
        return result;
    }

    float multiply(float x, float y) {
        float result = x * y;
        saveHistory("Multiply", result);
        return result;
    }

    void input();
    float divide();
    float modulus();
    float power();

    float getA() { return a; }
    float getB() { return b; }
    void setA(float x) { a = x; }
    void setB(float y) { b = y; }
};

void Calculator::input() {
    cout << "Enter first value: ";
    cin >> a;
    cout << "Enter second value: ";
    cin >> b;
}

float Calculator::divide() {
    if (b == 0) {
        cout << "Cannot divide by zero!" << endl;
        return 0;
    }
    float result = a / b;
    saveHistory("Divide", result);
    return result;
}

float Calculator::modulus() {
    if (b == 0) {
        cout << "Cannot mod by zero!" << endl;
        return 0;
    }
    float result = (int)a % (int)b;
    saveHistory("Modulus", result);
    return result;
}

float Calculator::power() {
    float result = pow(a, b);
    saveHistory("Power", result);
    return result;
}

int main() {
    int choice, type, method;
    float x, y, result;

    cout << "=== Object 1: Default Constructor ===" << endl;
    Calculator obj1;
    obj1.input();

    cout << "\n=== Object 2: Parameterized Constructor ===" << endl;
    cout << "Enter first value: ";
    cin >> x;
    cout << "Enter second value: ";
    cin >> y;
    Calculator obj2(x, y);

    int objectChoice;
    cout << "\nWhich object to use? (1 or 2): ";
    cin >> objectChoice;

    Calculator* cal;
    if (objectChoice == 1)
        cal = &obj1;
    else
        cal = &obj2;

    do {
        cout << "\n====== Calculator Menu ======" << endl;
        cout << "1. Add" << endl;
        cout << "2. Subtract" << endl;
        cout << "3. Multiply" << endl;
        cout << "4. Divide" << endl;
        cout << "5. Modulus" << endl;
        cout << "6. Power" << endl;
        cout << "7. Show History" << endl;
        cout << "0. Exit" << endl;
        cout << "Enter choice: ";
        cin >> choice;

        switch (choice) {
        case 1:
            cout << "1. Use object values  2. Enter new values: ";
            cin >> method;
            if (method == 1)
                result = cal->add();
            else {
                cout << "Enter two values: ";
                cin >> x >> y;
                result = cal->add(x, y);
            }
            cout << "Result: " << result << endl;
            break;

        case 2:
            cout << "1. Use object values  2. Enter new values: ";
            cin >> method;
            if (method == 1)
                result = cal->sub();
            else {
                cout << "Enter two values: ";
                cin >> x >> y;
                result = cal->sub(x, y);
            }
            cout << "Result: " << result << endl;
            break;

        case 3:
            cout << "1. Use object values  2. Enter new values: ";
            cin >> method;
            if (method == 1)
                result = cal->multiply();
            else {
                cout << "Enter two values: ";
                cin >> x >> y;
                result = cal->multiply(x, y);
            }
            cout << "Result: " << result << endl;
            break;

        case 4:
            result = cal->divide();
            cout << "Result: " << result << endl;
            break;

        case 5:
            result = cal->modulus();
            cout << "Result: " << result << endl;
            break;

        case 6:
            result = cal->power();
            cout << "Result: " << result << endl;
            break;

        case 7:
            cal->showHistory();
            break;

        case 0:
            cout << "Exiting..." << endl;
            break;

        default:
            cout << "Invalid choice." << endl;
        }

    } while (choice != 0);

    return 0;
}