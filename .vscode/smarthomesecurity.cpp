#include<iostream>
using namespace std;

class SmartLock {
private:
    string securityCode;
    bool isLocked;

public:
    SmartLock() {
        securityCode = "1234";
        isLocked = false;
    }

    void secureDoor() {
        isLocked = true;
        cout << "Door is now locked." << endl;
    }

    void unlockDoor(string enteredCode) {
        if (enteredCode == securityCode) {
            isLocked = false;
            cout << "Access granted. Door is now unlocked." << endl;
        } else {
            cout << "Wrong code! Access denied." << endl;
        }
    }

    void checkStatus() {
        if (isLocked)
            cout << "Door Status: Locked" << endl;
        else
            cout << "Door Status: Unlocked" << endl;
    }
};

int main() {
    SmartLock lock;

    lock.checkStatus();
    lock.secureDoor();
    lock.checkStatus();

    lock.unlockDoor("0000");
    lock.unlockDoor("1234");
    lock.checkStatus();

    return 0;
}