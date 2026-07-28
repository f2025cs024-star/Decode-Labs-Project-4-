#include<iostream>
using namespace std;

class Mobile {
    string brand;
    double price;
    int model;
    int stock;

public:

    void getdata() {
        cout << "Enter the brand of mobile: " << endl;
        cin >> brand;

        cout << "Enter the price of mobile: " << endl;
        cin >> price;

        cout << "Enter the model of mobile: " << endl;
        cin >> model;

        cout << "Enter the stock of mobile: " << endl;
        cin >> stock;
    }

    void display() {
        cout << "The brand of mobile is: " << brand << endl;
        cout << "The price of mobile is: " << price << endl;
        cout << "The model of mobile is: " << model << endl;
        cout << "The stock of mobile is: " << stock << endl;
        cout << endl;
    }

    void budget(Mobile M[], int n) {
        double budget;

        cout << "Enter your budget: " << endl;
        cin >> budget;

        cout << "\nMobiles within your budget are:\n" << endl;

        for (int i = 0; i < n; i++) {
            if (M[i].price <= budget) {
                cout << "Brand: " << M[i].brand << endl;
                cout << "Price: " << M[i].price << endl;
                cout << "Model: " << M[i].model << endl;
                cout << "Stock: " << M[i].stock << endl;
                cout << endl;
            }
        }
    }
};

int main() {

    Mobile M[5];

    for (int i = 0; i < 5; i++) {
        M[i].getdata();
    }

    cout << "\n--- Mobile Details ---\n" << endl;

    for (int i = 0; i < 5; i++) {
        M[i].display();
    }

    M[0].budget(M, 5);

    return 0;
}