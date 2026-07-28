#include <iostream>
using namespace std;

class Calculator
{
private:
    int num1, num2;

public:
    void input();
    void add();
    void subtract();
    void multiply();
    void divide();
    void modulus();
};

void Calculator::input()
{
    cout << "Enter first number: ";
    cin >> num1;
    cout << "Enter second number: ";
    cin >> num2;
}

void Calculator::add()
{
    cout << "Addition = " << num1 + num2 << endl;
}

void Calculator::subtract()
{
    cout << "Subtraction = " << num1 - num2 << endl;
}

void Calculator::multiply()
{
    cout << "Multiplication = " << num1 * num2 << endl;
}

void Calculator::divide()
{
    if(num2 != 0)
        cout << "Division = " << num1 / num2 << endl;
    else
        cout << "Division not possible (divide by zero)" << endl;
}

void Calculator::modulus()
{
    if(num2 != 0)
        cout << "Modulus = " << num1 % num2 << endl;
    else
        cout << "Modulus not possible" << endl;
}

int main()
{
    Calculator c;
    int choice;

    c.input();

    cout << "\nMenu:\n";
    cout << "1. Addition\n";
    cout << "2. Subtraction\n";
    cout << "3. Multiplication\n";
    cout << "4. Division\n";
    cout << "5. Modulus\n";
    cout << "Enter your choice: ";
    cin >> choice;

      if(choice==1){
        c.add();}
        else if(choice==2){
        c.subtract();}
        else if(choice==3) {
            c.multiply();}
        else if(choice==4){
            c.divide();}
            else if(choice==5){
             c.modulus(); }
                else{
                    cout << "invalid input"<<endl;
                }
                return 0;
      }
    

    
