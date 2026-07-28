#include<iostream>
#include<string>
using namespace std;

class Router {
private:
    string* devices;
    int count;

public:
    Router() {
        cout << "How many devices are connected? ";
        cin >> count;
        devices = new string[count];
        for (int i = 0; i < count; i++) {
            cout << "Enter device " << i + 1 << " name: ";
            cin >> devices[i];
        }
    }

    void showDevices() {
        cout << "Connected Devices:" << endl;
        for (int i = 0; i < count; i++) {
            cout << "- " << devices[i] << endl;
        }
    }

    ~Router() {
        delete[] devices;
        cout << "Router removed. Memory released." << endl;
    }
};

int main() {
    Router r;
    r.showDevices();
    return 0;
}   